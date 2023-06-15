import {
  DICES_VALUES,
  DIMENSION_GRID,
  DiceState,
  DragEvents,
  // DiceState,
  MAX_VALUE_DICE,
  MIN_VALUE_DICE,
  NEIGHBOR_POSITIONS,
  OFFSET_ITEM,
  SIZE_ITEM,
} from "../../utils/constants";
import type {
  DiceDrag,
  DragEventsType,
  GridItemType,
  GridType,
  Neighbors,
  RenderDices,
  TypeDice,
  TypeOrientation,
} from "../../interfaces";
import { randomNumber } from "../../utils/helpers";
import cloneDeep from "lodash.clonedeep";

/**
 * Función que devuelve cuantos slots están disponibles...
 * @param gridData
 * @returns
 */
const getTotalSpaceAvailable = (gridData: GridType) => {
  let counter = 0;

  for (let i = 0; i < gridData.length; i++) {
    for (let c = 0; c < gridData.length; c++) {
      if (!gridData[i][c]?.dice) {
        counter++;
      }
    }
  }

  return counter;
};

/**
 * Retorna el total de un dado en el la grilla...
 * @param gridData
 * @param type
 * @returns
 */
const getTotalDice = (gridData: GridType, type: TypeDice) => {
  let total = 0;

  for (let i = 0; i < gridData.length; i++) {
    for (let c = 0; c < gridData.length; c++) {
      if (gridData[i][c]?.dice?.type === type) {
        total += 1;
      }
    }
  }

  return total;
};

/**
 * Retorna un array del total por cada dado en la grilla.
 * @param gridData
 * @returns
 */
const getTotalDiceByType = (gridData: GridType) => {
  const totals: { type: TypeDice; total: number }[] = [];

  for (let type = MIN_VALUE_DICE; type <= MAX_VALUE_DICE; type++) {
    totals.push({
      type,
      total: getTotalDice(gridData, type),
    });
  }

  return totals;
};

/**
 * Valida si una coordenada está dentro del rango de la grilla...
 * @param row
 * @param col
 * @returns
 */
const isRange = (row: number, col: number) =>
  row >= 0 && row < DIMENSION_GRID && col >= 0 && col < DIMENSION_GRID;

/**
 * Devuelve los vecinos de un ítem..
 * @param gridData
 * @param row
 * @param col
 * @returns
 */
const getNeighbors = (gridData: GridType, row: number, col: number) => {
  const neighbors: { [key: string]: GridItemType } = {};

  for (let key in NEIGHBOR_POSITIONS) {
    const position = NEIGHBOR_POSITIONS[key as Neighbors];
    const newRow = row + position.row;
    const newCol = col + position.col;

    if (isRange(newRow, newCol)) {
      neighbors[key] = gridData[newRow][newCol];
    }
  }

  return neighbors;
};

/**
 * Valida si hay dos espacios disponibles en el board,
 * este caso es para validar si se pueden poner dos dados...
 * @param gridData
 * @returns
 */
const isTwoAvailableSpaces = (gridData: GridType) => {
  let availableSpace = false;

  for (let i = 0; i < gridData.length; i++) {
    for (let c = 0; c < gridData.length; c++) {
      // Primero saber si está libre...
      if (!gridData[i][c]?.dice) {
        // Ahora saber si uno de los vecinos está libre...
        const neighbors = getNeighbors(gridData, i, c);
        // Si devuelve a alguno libre será true...
        availableSpace =
          Object.keys(neighbors).filter((v) => !neighbors[v]?.dice).length !==
          0;

        if (availableSpace) {
          break;
        }
      }
    }

    if (availableSpace) {
      break;
    }
  }

  return availableSpace;
};

/**
 * Dado los valores de los dados, devuelve un valor aleatorio, de esos valores...
 * @param dices
 * @returns
 */
const getRandomDieFromArray = (dices: TypeDice[]) =>
  dices[randomNumber(0, dices.length - 1)];

/**
 * Función que evalua si es posible ubicar los dados en la grilla
 * En este caso valida tanto para un dado como para dos
 * Si la validación es satisfactoria, devuevle la información del dado a renderizar
 * en este caso el tipo, fila, columna y posición...
 * @param gridData
 * @param diceDrag
 * @param diceOneRow
 * @param diceOneCol
 * @returns
 */
const validatePositionDices = (
  gridData: GridType,
  diceDrag: DiceDrag,
  diceOneRow: number,
  diceOneCol: number
) => {
  const { dices, typeOrientation, orientation } = diceDrag;
  const renderDices: RenderDices[] = [];

  /**
   * Si es de tipo single se podrá poner en la grilla,
   * ya que si existió el over es que estaba libre,
   * pero so es MULTIPLE se debe evaluar el dado dos y su posición.
   */
  let setDiceOnGrid = typeOrientation === "SINGLE";

  // Para indicar el valor del dado uno por defecto
  // Si es uno sólo, por efecto será la posición cero...
  const diceOneIndex =
    typeOrientation === "SINGLE"
      ? 0
      : orientation === 0 || orientation === 1
      ? 0
      : 1;

  // Se almacena la información del dado uno...
  renderDices.push({
    type: dices[diceOneIndex],
    x: gridData[diceOneRow][diceOneCol].x,
    y: gridData[diceOneRow][diceOneCol].y,
    row: diceOneRow,
    col: diceOneCol,
  });

  // Es de tipo múltiple así que se debe evaluar el dado dos...
  if (typeOrientation === "MULTIPLE") {
    // Dependiendo de la orietación se valida al posición que se debe evaluar del vecino...
    const positionNeighbor =
      orientation === 0 || orientation === 2 ? "BOTTOM" : "LEFT";

    // Se obtiene los vecinos...
    const neighbors = getNeighbors(gridData, diceOneRow, diceOneCol);

    console.log("neighbors", neighbors);

    // Se valida si existe el vecino y que además no exista un dado esa posición...
    if (neighbors[positionNeighbor] && !neighbors[positionNeighbor].dice) {
      // Se obtiene el índice del dado en el vector de dados que se están arrastrando...
      const diceTwoIndex = orientation === 0 || orientation === 1 ? 1 : 0;

      // Se almacena la información del dado dos...
      renderDices.push({
        type: dices[diceTwoIndex],
        x: neighbors[positionNeighbor].x,
        y: neighbors[positionNeighbor].y,
        row: neighbors[positionNeighbor].row,
        col: neighbors[positionNeighbor].col,
      });

      setDiceOnGrid = true;
    }
  }

  return setDiceOnGrid ? renderDices : [];
};

/**
 * Función que crea la data inicial de la grilla
 * @returns
 */
export const initialGridData = () => {
  const newGrid: GridType = [];

  let index = 0;

  for (let i = 0; i < DIMENSION_GRID; i++) {
    newGrid[i] = [];

    for (let c = 0; c < DIMENSION_GRID; c++) {
      const x = i + (SIZE_ITEM + OFFSET_ITEM) * i;
      const y = c + (SIZE_ITEM + OFFSET_ITEM) * c;

      newGrid[i][c] = {
        index,
        row: i,
        col: c,
        size: SIZE_ITEM,
        x,
        y,
        // dice: {
        //   type: randomNumber(1, 6) as TypeDice,
        //   state: DiceState.VISIBLE,
        //   x,
        //   y,
        // },
      };

      index++;
    }
  }

  return newGrid;
};

/**
 * Genera la data de los dados que se arrastran.
 * @param gridData
 */
export const getDiceDrag = (gridData: GridType): DiceDrag => {
  /**
   * Se valida si hay algún espacio disponible en el board...
   */
  const totalSpaceAvailable = getTotalSpaceAvailable(gridData);

  /**
   * Se muestra el elemento a arrastrar si hay espacio disponible, si no es así
   * se ocultará...
   */
  const isVisible = totalSpaceAvailable !== 0;

  /**
   * Se trae el total de dados por tipo
   * se ordenan de mayor a menor.
   * Sólo se dejan aquellos que no sean cero,
   * es decir que no tienen ningún valor en la grilla...
   */
  const toalDiceByType = getTotalDiceByType(gridData)
    .sort((a, b) => b.total - a.total)
    .filter((v) => v.total !== 0);

  // Se obtiene aleatoriamente el número de dados que se van a arrastrar...
  // let total = randomNumber(1, 2);
  let total = 2;

  /**
   * Determina si se selecciona de los dados que están en la
   * grilla o se toman aleatoriamente de todos los dados (1 - 6)
   * si el valor de espacios disponibles es menos que cinco,
   * no se hace aleatoriedad y se deja que se tomen los dados
   * de los valores que están en la grilla...
   */
  const randomPickDice = totalSpaceAvailable > 5 ? randomNumber(0, 1) : 0;

  /**
   * Crea los dados que se pueden seleccionar...
   * Si el valor de elementos ya existentes en el board,
   * es menor que tres (además que sea diferente de cero)
   * Si toman los valores de 1 - 6, el 7 que es el final se obvia
   * Si es mayor que tres, se toman esos valores
   * así se le entregan valores que el usuario puede usar en el board,
   * para tener mayor probabilidad de completar el board...
   */
  const dicePick: TypeDice[] =
    toalDiceByType.length < 3 || randomPickDice === 1
      ? DICES_VALUES
      : toalDiceByType.slice(0, 3).map((v) => v.type);

  // Si el total de dados es de dos, se valida si hay espacio para dos
  // si no es así se dejará un total de uno...
  if (total === 2 && !isTwoAvailableSpaces(gridData)) {
    total = 1;
  }

  /**
   * Si se tienen dos dados, se obtiene la orientación de forma aleatorio,
   * si es sólo un dado, simpere sera cero...
   */
  const orientation = total === 2 ? randomNumber(0, 3) : 0;

  /**
   * Se indica el tipo de orientación, dependiendo de la cantidad de dados a arrastar...
   */
  const typeOrientation: TypeOrientation = total === 1 ? "SINGLE" : "MULTIPLE";

  /**
   * Se obtiene el valor del primer dado que siempre debe estar,
   * el valor obtenido depende de los valores disponibles en dicePick
   */
  const dices = [getRandomDieFromArray(dicePick)];

  /**
   * Se obtiene el otro valor del dado, si el total era dos
   */
  if (total === 2 && isVisible) {
    do {
      /**
       * Se obtiene el valor del dado dos
       */
      let diceTwo = getRandomDieFromArray(dicePick);

      /**
       * Se valida que el dado sea diferente al primer dado...
       */
      if (diceTwo !== dices[0]) {
        dices.push(diceTwo);
        break;
      }
    } while (1);
  }

  return {
    dices,
    typeOrientation,
    orientation,
    isVisible,
    totalMerges: 1,
  };
};

/**
 * Establece la rotación para los dados que se están arrastrando...
 * @param diceDrag
 * @returns
 */
export const rotateDiceDrag = (diceDrag: DiceDrag) => {
  const copyDiceDrag = cloneDeep(diceDrag);

  copyDiceDrag.orientation =
    copyDiceDrag.orientation + 1 === 4 ? 0 : copyDiceDrag.orientation + 1;

  return copyDiceDrag;
};

interface PutDiceOnGrid {
  diceDrag: DiceDrag;
  gridData: GridType;
  over: string;
  typeEvent: DragEventsType;
  setDiceDrag: React.Dispatch<React.SetStateAction<DiceDrag>>;
  setGridData: React.Dispatch<React.SetStateAction<GridType>>;
}

export const putDiceOnGrid = ({
  diceDrag,
  gridData,
  over,
  typeEvent,
  setDiceDrag,
  setGridData,
}: PutDiceOnGrid) => {
  const copyGridData = cloneDeep(gridData);
  let updateGrid = false;

  // Hacer un proceso de limpieza de los elementos que no sean de tipo VISIBLE...
  for (let i = 0; i < copyGridData.length; i++) {
    for (let c = 0; c < copyGridData[i].length; c++) {
      if (
        copyGridData[i][c]?.dice?.state &&
        copyGridData[i][c]?.dice?.state !== DiceState.VISIBLE
      ) {
        const state = copyGridData[i][c]?.dice?.state;
        // Si es ghost o hide, se elimina el dado de la grilla...
        if (state === DiceState.GHOST || state === DiceState.HIDE) {
          copyGridData[i][c].dice = undefined;
        } else {
          // Si es por ejemplo de tipo APPEAR, lo deja visible
          // APPEAR es para una animación...
          copyGridData[i][c].dice!.state = DiceState.VISIBLE;
        }

        if (!updateGrid) {
          updateGrid = true;
        }
      }
    }
  }

  if (over !== "") {
    const [diceOneRow, diceOneCol] = over.split("-").map((v) => +v);

    const dices = validatePositionDices(
      copyGridData,
      diceDrag,
      diceOneRow,
      diceOneCol
    );

    if (dices.length !== 0) {
      for (let { row, col, type } of dices) {
        // TODO: Se validará el dado estrella...
        const typeDice = type;

        copyGridData[row][col].dice = {
          type: typeDice,
          state: DiceState[typeEvent === DragEvents.END ? "VISIBLE" : "GHOST"],
          x: copyGridData[row][col].x,
          y: copyGridData[row][col].y,
        };
      }

      if (!updateGrid) {
        updateGrid = true;
      }
    }
    // console.log({ diceOneRow, diceOneCol, dices });
  }

  if (updateGrid) {
    setGridData(copyGridData);
  }

  // console.log({ typeEvent, over });
};
