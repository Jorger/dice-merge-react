import {
  DICES_VALUES,
  DIMENSION_GRID,
  DiceState,
  DragEvents,
  MAX_VALUE_DICE,
  MIN_VALUE_DICE,
  MIN_VALUE_MERGE,
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

    // console.log("neighbors", neighbors);

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

interface NeighborsMerge {
  row: number;
  col: number;
  index: number;
}

/**
 * Función que valida los elementos que se podrían unir
 * En este caso se hace una llamada recursiva la cual trae los elementos que sean del mismo
 * tipo, del valor pasado a la función (valor obtenido de la fila y columna)
 * validatedIndexes persiste los valores que ya se han evaluado...
 * @param gridData
 * @param row
 * @param col
 * @param type
 * @param validatedIndexes
 * @returns
 */
const validateNeighborsMerge = (
  gridData: GridType,
  row: number,
  col: number,
  type: TypeDice,
  validatedIndexes: number[] = []
) => {
  // Guarda la información de los vecinos que se deben unnir...
  const neighborsMerge: NeighborsMerge[] = [];
  const { index } = gridData[row][col];

  // Validar si el index ya se encuentra en los valores validados...
  // Si es así no se evalúa nada...
  if (validatedIndexes.includes(index)) {
    return [];
  }

  // Se obtiene los vecinos para el dado que se está evaluando...
  const neighbors = getNeighbors(gridData, row, col);

  // Guardará los demás vecinos...
  let newNeighborsMerge: NeighborsMerge[] = [];

  // Se itera cada uno de los vecinos que tiene el elemento evaluado
  // en cada una de las direcciones que tenga...
  for (let direction in neighbors) {
    const {
      dice: diceNeighbor,
      row: rowNeighbor,
      col: colNeighbor,
      index: indexNeighbor,
    } = neighbors[direction];

    // Buscar si el elemento ya se encuentra entre los vecinos encontrados antes...
    const existNeighbor =
      newNeighborsMerge.findIndex((v) => v.index === indexNeighbor) >= 0;

    /**
     * Se avlua el vecino si:
     * No se había evaluado antes.
     * Exista un dado y el estado del mismo sea de tipo VISIBLE.
     * Además que el dado sea del mismo tipo
     * TODO: ó que sea de tipo especial (8) Dado estrella...
     * Los valores de los indices evaluados anteriormete
     * no se encuentre en validatedIndexes
     */
    if (
      !existNeighbor &&
      diceNeighbor &&
      diceNeighbor.state === DiceState.VISIBLE &&
      diceNeighbor.type === type &&
      !validatedIndexes.includes(indexNeighbor)
    ) {
      // debugger;
      // Se guarda el nuevo vecino...
      neighborsMerge.push({
        row: rowNeighbor,
        col: colNeighbor,
        index: indexNeighbor,
      });

      // Recursivamente se evalua si el nuevo vecino, tiene vecinos adicionales...
      const newData = validateNeighborsMerge(
        gridData,
        rowNeighbor,
        colNeighbor,
        type,
        [...validatedIndexes, index]
      );

      // Se une la información de los vecinos anterioes, con los nuevos vecinos...
      newNeighborsMerge = [...newNeighborsMerge, ...newData];
    }
  }

  /**
   * Se une la información de los vecinos obtenidos para el ítem evaluado en la función
   * con la información de los demás vecinos...
   */
  const finalMerge = [...neighborsMerge, ...newNeighborsMerge];

  return finalMerge;
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
        // dice:
        //   i === 0 || c === 0
        //     ? {
        //         type: 5,
        //         state: DiceState.VISIBLE,
        //         x,
        //         y,
        //       }
        //     : undefined,
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
  let total = randomNumber(1, 2);
  // let total = 2;

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
  // const dices = [5 as TypeDice];

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
      // Se itera los dados que se han puesto en la grilla...
      for (let { row, col, type } of dices) {
        // TODO: Se validará el dado estrella...
        const typeDice = type;

        // Si la acción es que se ha puesto el dado en la grilla
        // el tipo del dado será visible, si no será ghost...
        copyGridData[row][col].dice = {
          type: typeDice,
          state: DiceState[typeEvent === DragEvents.END ? "VISIBLE" : "GHOST"],
          x: copyGridData[row][col].x,
          y: copyGridData[row][col].y,
        };

        /**
         * Si la acción es over, se buscan los posibles elementos
         * con los que cada dado podría hacer merge
         */
        if (typeEvent === DragEvents.OVER) {
          const neighborsMerge = validateNeighborsMerge(
            copyGridData,
            row,
            col,
            typeDice
          );

          /**
           * Se valida que el valor de elementos a hacer merger sea mayor o igual que 3
           * en este caso sería dos, por que sería el valor evaluado y dos o más adicionales...
           * el elemento actual no se encuetra entre los vecinos...
           */
          if (neighborsMerge.length >= MIN_VALUE_MERGE - 1) {
            /**
             * Se itrea cada uno de los posibles elementos a hacer merge
             * y se le establece la clase SHAKE...
             */
            for (let neighbors of neighborsMerge) {
              copyGridData[neighbors.row][neighbors.col].dice!.state =
                DiceState.SHAKE;
            }
          }
        }
      }

      if (!updateGrid) {
        updateGrid = true;
      }

      if (typeEvent === DragEvents.END) {
        console.log("EVALUAR END");

        const copyDiceDrag = cloneDeep(diceDrag);
        copyDiceDrag.isVisible = false;
        copyDiceDrag.dropDices = dices;
        setDiceDrag(copyDiceDrag);
      }
    }
    // console.log({ diceOneRow, diceOneCol, dices });
  }

  if (updateGrid) {
    setGridData(copyGridData);
  }

  // console.log({ typeEvent, over });
};

interface ValidateMergeDice {
  gridData: GridType;
  diceDrag: DiceDrag;
}

export const validateMergeDice = ({
  gridData,
  diceDrag,
}: ValidateMergeDice) => {
  const copyDiceDrag = cloneDeep(diceDrag);
  const copyGridData = cloneDeep(gridData);

  let existsMerge = false;

  console.log("diceDrag", diceDrag.dropDices);

  if (copyDiceDrag?.dropDices) {
    /**
     * Se debe trae los que se unen,
     * primero se busca el menor (si es que hay dos)
     * Se ordenan los valores de los dados que se han puesto en el board
     * de menor a mayor, de esta manera simpre se evalúa el valor menor
     */
    const diceSorted = copyDiceDrag.dropDices.sort((a, b) => a.type - b.type);

    // console.log("diceSorted", diceSorted);

    // Se iteran los dados puestos en el board, mínimo uno, máximo dos...
    for (let i = 0; i < diceSorted.length; i++) {
      const { row: diceRow = 0, col: diceCol = 0, type } = diceSorted[i];

      if (
        copyGridData[diceRow][diceCol].dice &&
        type >= MIN_VALUE_DICE &&
        type <= MAX_VALUE_DICE
      ) {
        console.log("diceSorted", i, diceSorted[i]);
        // TODO: Validar el dado tipo estrella...
        let typeDice = type;
        /**
         * Se trae los posibles elementos para hacer merge
         */
        const neighborsMerge = validateNeighborsMerge(
          copyGridData,
          diceRow,
          diceCol,
          typeDice
        );

        console.log({ typeDice }, "neighborsMerge", neighborsMerge);

        if (neighborsMerge.length >= MIN_VALUE_MERGE - 1) {
          // Se debe mutar la grilla...
          existsMerge = true;

          /**
           * Se itera los vecinos y se le establece el tipo HIDE,
           * se cambia la posición del dado, para que la animación muestre que los
           * dados se van a la posición del elemento evaluado...
           */
          for (let neighbors of neighborsMerge) {
            copyGridData[neighbors.row][neighbors.col].dice!.state =
              DiceState.HIDE;
            copyGridData[neighbors.row][neighbors.col].dice!.x =
              diceSorted[i].x;
            copyGridData[neighbors.row][neighbors.col].dice!.y =
              diceSorted[i].y;
          }

          // TODO: Evaluar el dado tipo estrella...
          if (typeDice + 1 <= 7) {
            // TODO: Evaluar el dado tipo estrella...
            const newDiceType = (typeDice + 1) as TypeDice;
            // Se le establece una clase para que se muestre
            copyGridData[diceRow][diceCol].dice.state = DiceState.APPEAR;
            // Se incrementa el valor evaluado...
            copyGridData[diceRow][diceCol].dice.type = newDiceType;

            /**
             * Se incrementa el valor del ítem que se había arrastrando,
             * por ejemplo si el valor del dado era 2, pasa a 3
             * esto con el fin de actualizar el valor y así hacer otra validación de merge
             */
            copyDiceDrag.dropDices[i].type = newDiceType;
            // Se incrementa el total de merges que se han lanzado en el mismo lanzamiento...
            copyDiceDrag.totalMerges++;
          } else {
            copyGridData[diceRow][diceCol].dice.state = DiceState.DISAPEAR;
            // TODO: validar el score...
          }

          break;
        }
      }
    }
  }

  return {
    existsMerge,
    copyGridData,
    copyDiceDrag,
  };
};

/**
 * Función que limpia la grilla de estados de los dados..
 * @param gridData
 * @returns
 */
export const clearGrid = (gridData: GridType) => {
  const copyGridData = cloneDeep(gridData);

  let isLastDiceMerge = false;

  /**
   * Se eliminan los dados de la grilla
   * sólo si tienen los estados HIDE y DISAPEAR
   */
  for (let i = 0; i < copyGridData.length; i++) {
    for (let c = 0; c < copyGridData[i].length; c++) {
      const dice = copyGridData[i][c]?.dice;

      if (dice?.state) {
        const { state, type } = dice;

        if (state === DiceState.HIDE || state === DiceState.DISAPEAR) {
          if (!isLastDiceMerge && type === 7 && state === DiceState.DISAPEAR) {
            isLastDiceMerge = true;
          }

          copyGridData[i][c].dice = undefined;
        }
      }
    }
  }

  /**
   * Se valida si con la nueva grilla hay espacio para poner algún dado...
   */
  const isASpaceAvailable = getTotalSpaceAvailable(copyGridData) !== 0;

  return { copyGridData, isASpaceAvailable, isLastDiceMerge };
};
