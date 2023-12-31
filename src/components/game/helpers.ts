import { TypeIcon } from "../icon";
import {
  DEFAULT_SCORE_CACHE,
  DICES_VALUES,
  DIMENSION_GRID,
  DiceState,
  DragEvents,
  HELPS,
  MAX_MERGES_NEXT_LEVEL,
  MAX_VALUE_DICE,
  MIN_VALUE_DICE,
  MIN_VALUE_MERGE,
  NEIGHBOR_POSITIONS,
  OFFSET_ITEM,
  SCORE_DICE_ALL,
  SIZE_ITEM,
  TYPES_HELPS,
} from "../../utils/constants";
import {
  deleteProperty,
  getValueFromCache,
  saveMultiplePropierties,
  savePropierties,
} from "../../utils/storage";
import {
  getCurrentTimeStamp,
  isValidTimeStamp,
  randomNumber,
} from "../../utils/helpers";
import cloneDeep from "lodash.clonedeep";
import type {
  CachedScore,
  DiceDrag,
  DiceGrid,
  DragEventsType,
  GridItemType,
  GridType,
  HelpsGame,
  Neighbors,
  RenderDices,
  Score,
  ScoreMessages,
  TotalMaxHelps,
  TypeDice,
  TypeHelps,
  TypeOrientation,
  UndoValues,
} from "../../interfaces";

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
  const { dices, typeOrientation, orientation, isStar } = diceDrag;
  const renderDices: RenderDices[] = [];

  /**
   * Si es de tipo single se podrá poner en la grilla,
   * ya que si existió el over es que estaba libre,
   * pero so es MULTIPLE se debe evaluar el dado dos y su posición.
   */
  let setDiceOnGrid = typeOrientation === "SINGLE" || isStar;

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
    type: !isStar ? dices[diceOneIndex] : 8,
    x: gridData[diceOneRow][diceOneCol].x,
    y: gridData[diceOneRow][diceOneCol].y,
    row: diceOneRow,
    col: diceOneCol,
  });

  // Es de tipo múltiple así que se debe evaluar el dado dos...
  if (typeOrientation === "MULTIPLE" && !isStar) {
    // Dependiendo de la orietación se valida al posición que se debe evaluar del vecino...
    const positionNeighbor =
      orientation === 0 || orientation === 2 ? "BOTTOM" : "LEFT";

    // Se obtiene los vecinos...
    const neighbors = getNeighbors(gridData, diceOneRow, diceOneCol);

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
     * ó que sea de tipo especial (8) Dado estrella...
     * Los valores de los indices evaluados anteriormete
     * no se encuentre en validatedIndexes
     */
    if (
      !existNeighbor &&
      diceNeighbor &&
      diceNeighbor.state === DiceState.VISIBLE &&
      (diceNeighbor.type === type || diceNeighbor.type === 8) &&
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
 * Dada la grilla, genera un objeto con los elementos que estén activos
 * útil para localstorage y para el undo del juego..
 * @param gridData
 * @returns
 */
const convertGridHashTable = (gridData: GridType) => {
  const grid: Record<string, number> = {};

  for (let i = 0; i < gridData.length; i++) {
    for (let c = 0; c < gridData[i].length; c++) {
      const state = gridData[i][c].dice && gridData[i][c].dice?.state;

      if (
        state === DiceState.VISIBLE ||
        state === DiceState.SHAKE ||
        state === DiceState.APPEAR
      ) {
        grid[`${i}-${c}`] = gridData[i][c].dice?.type || 0;
      }
    }
  }

  return grid;
};

/**
 * Valida si los valores de la grilla almacenada son válidos...
 * @param cachedGrid
 * @returns
 */
const validateCachedGrid = (cachedGrid: Record<string, number> = {}) => {
  try {
    for (let key in cachedGrid) {
      const [row, col] = key.split("-").map((v) => +v);
      const value = cachedGrid[key];

      /**
       * Si el valor de la posición no está en rago o si los valores de los
       * dados no es válido, el valor almacenado en la caché, no se tiene en cuenta...
       */
      if (!isRange(row, col) || value < 0 || value > MAX_VALUE_DICE) {
        return {};
      }
    }

    return cachedGrid;
  } catch (_) {
    return {};
  }
};

/**
 * Retorna el total de una ayuda...
 * @param type
 * @returns
 */
const getTotalHelp = (type: TypeHelps) => {
  const currentTimestamp = getCurrentTimeStamp();
  const cache: TotalMaxHelps = getValueFromCache("helps", TYPES_HELPS);
  const cacheTimestamp: number = getValueFromCache(
    "timestamp",
    currentTimestamp
  );

  const timestamp = isValidTimeStamp(cacheTimestamp)
    ? cacheTimestamp
    : currentTimestamp;

  let total = 0;

  if (timestamp === currentTimestamp) {
    total = cache[type] <= TYPES_HELPS[type] ? cache[type] : TYPES_HELPS[type];
  } else {
    if (currentTimestamp > timestamp) {
      total = TYPES_HELPS[type];
    }
  }

  return total;
};

/**
 * Retorna los valores de las ayudas que se guardarán en la cache..
 * @param helpsGame
 * @returns
 */
const getNewCacheHelps = (helpsGame: HelpsGame) =>
  Object.keys(helpsGame)
    .map((v) => ({ [v]: helpsGame[v as TypeHelps].remaining }))
    .reduce((a, s) => ({ ...a, ...s }), {});

/**
 * Función que crea la data inicial de la grilla
 * @returns
 */
export const initialGridData = () => {
  const newGrid: GridType = [];
  // Obtener la información si existe en localstorage
  const cachedGrid = validateCachedGrid(getValueFromCache("grid", {}));

  let index = 0;

  for (let i = 0; i < DIMENSION_GRID; i++) {
    newGrid[i] = [];

    for (let c = 0; c < DIMENSION_GRID; c++) {
      const x = i + (SIZE_ITEM + OFFSET_ITEM) * i;
      const y = c + (SIZE_ITEM + OFFSET_ITEM) * c;

      const dice: DiceGrid | undefined = cachedGrid[`${i}-${c}`]
        ? {
            type: cachedGrid[`${i}-${c}`] as TypeDice,
            state: DiceState.VISIBLE,
            x,
            y,
          }
        : undefined;

      newGrid[i][c] = {
        index,
        row: i,
        col: c,
        size: SIZE_ITEM,
        x,
        y,
        dice,
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

  // Se acualiza la información de orienración en la caché...
  savePropierties("drag", {
    dices: copyDiceDrag.dices,
    dir: copyDiceDrag.orientation,
  });

  return copyDiceDrag;
};

interface PutDiceOnGrid {
  diceDrag: DiceDrag;
  gridData: GridType;
  helpsGame: HelpsGame;
  over: string;
  score: Score;
  typeEvent: DragEventsType;
  undo: UndoValues[];
  setDiceDrag: React.Dispatch<React.SetStateAction<DiceDrag>>;
  setGridData: React.Dispatch<React.SetStateAction<GridType>>;
  setHelpsGame: React.Dispatch<React.SetStateAction<HelpsGame>>;
  setUndo: React.Dispatch<React.SetStateAction<UndoValues[]>>;
}

export const putDiceOnGrid = ({
  diceDrag,
  gridData,
  helpsGame,
  over,
  score,
  typeEvent,
  undo = [],
  setDiceDrag,
  setGridData,
  setHelpsGame,
  setUndo,
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
        const typeDice = !diceDrag.isStar ? type : 8;

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
        // Tenía una estrella seleccionada
        // por lo tanto, se debe indicar que se ha utilizado...
        // y se debe disminuir su valor...
        if (diceDrag.isStar) {
          const copyHelpsGame = cloneDeep(helpsGame);
          copyHelpsGame.STAR.remaining--;
          copyHelpsGame.STAR.selected = false;
          setHelpsGame(copyHelpsGame);

          // Guarda en localStorage...
          saveMultiplePropierties({
            helps: getNewCacheHelps(copyHelpsGame),
            timestamp: getCurrentTimeStamp(),
          });
        }

        /**
         * Se establece que drag no es visible, además se almacena
         * los dados que se han puesto, para de esta forma poderlos usar
         * depués en la evaluación de merge...
         */
        const copyDiceDrag = cloneDeep(diceDrag);
        copyDiceDrag.isVisible = false;
        copyDiceDrag.isStar = false;
        copyDiceDrag.dropDices = dices;
        setDiceDrag(copyDiceDrag);

        /**
         * Como ya se ha establecido el elemento en la grilla,
         * se guarda el valor en el undo...
         * se valida que tenga undos disponibles, si no es así,
         * no se guardará el valor en el estado...
         */
        if (helpsGame.UNDO.remaining > 0) {
          const copyUndo = cloneDeep(undo);

          // Se agrea el nuevo undo...
          copyUndo.push({
            grid: convertGridHashTable(gridData),
            score: {
              score: score.score.score,
              best: score.score.best,
              progress: score.progress.value,
              level: score.progress.level,
            },
            drag: {
              dices: diceDrag.dices,
              dir: diceDrag.orientation,
            },
          });

          /**
           * Sólo se obtienen el máximo de undos,
           * por ejemplo si el valor es 5, sólo se guardarán los últimos cinco
           */
          setUndo(copyUndo.splice(TYPES_HELPS.UNDO * -1));
        }
      }
    }
  }

  if (updateGrid) {
    setGridData(copyGridData);
  }
};

interface ValidateMergeDice {
  gridData: GridType;
  diceDrag: DiceDrag;
  score: Score;
}

export const validateMergeDice = ({
  gridData,
  diceDrag,
  score,
}: ValidateMergeDice) => {
  const copyDiceDrag = cloneDeep(diceDrag);
  const copyGridData = cloneDeep(gridData);
  const copyScore = cloneDeep(score);
  const newScoreMessage: ScoreMessages = { value: 0, timeStamp: 0, x: 0, y: 0 };

  let nextLevel = false;
  let existsMerge = false;

  if (copyDiceDrag?.dropDices) {
    /**
     * Se debe trae los que se unen,
     * primero se busca el menor (si es que hay dos)
     * Se ordenan los valores de los dados que se han puesto en el board
     * de menor a mayor, de esta manera simpre se evalúa el valor menor
     */
    const diceSorted = copyDiceDrag.dropDices.sort((a, b) => a.type - b.type);

    // Se iteran los dados puestos en el board, mínimo uno, máximo dos...
    for (let i = 0; i < diceSorted.length; i++) {
      const { row: diceRow = 0, col: diceCol = 0, type } = diceSorted[i];

      if (
        copyGridData[diceRow][diceCol].dice &&
        type >= MIN_VALUE_DICE &&
        type <= MAX_VALUE_DICE
      ) {
        let typeDice = type;

        // Saber si el tipo de dado es una ayuda de tipo estrella...
        const isStar = type === 8;

        let neighborsMerge: NeighborsMerge[] = [];

        /**
         * Si es de tipo espcial se buscan los vecinos
         */
        if (isStar) {
          // Se traen los vecinos...
          const neighborsStar = getNeighbors(copyGridData, diceRow, diceCol);
          // Buscar los valores de los vecinos posibles...
          const possibleDiceValues = Object.keys(neighborsStar)
            .filter((v) => neighborsStar[v].dice)
            .map((v) => neighborsStar[v].dice?.type)
            .sort();

          // Se itera los valore de cada uno de los vecinos posibles...
          for (let possibleDice of possibleDiceValues) {
            // Se trae la información de posibles merges...
            const possibleMerge = validateNeighborsMerge(
              copyGridData,
              diceRow,
              diceCol,
              possibleDice as TypeDice
            );

            // Validar si cumple la validación mínima de merge...
            if (possibleMerge.length >= MIN_VALUE_MERGE - 1) {
              // Si la cumple se establece el valor del dado por el cual se debe evaluar
              typeDice = possibleDice as TypeDice;
              // Y se estableve este valor de los vecinos que se deben unir...
              neighborsMerge = possibleMerge;
              break;
            }
          }
        } else {
          /**
           * Se trae los posibles elementos para hacer merge
           */
          neighborsMerge = validateNeighborsMerge(
            copyGridData,
            diceRow,
            diceCol,
            typeDice
          );
        }

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

          if (typeDice + 1 <= 7 || typeDice === 8) {
            /**
             * Se establece el nuevo valor del dado,
             * Si el merge es de un dado especial, se indica que el nuevo valor
             * del dado será de dos...
             */
            const newDiceType =
              typeDice === 8 ? 2 : ((typeDice + 1) as TypeDice);
            // Se le establece una clase para que se muestre
            copyGridData[diceRow][diceCol].dice.state = DiceState.APPEAR;
            // Se incrementa el valor evaluado...
            copyGridData[diceRow][diceCol].dice.type = newDiceType;
            // El valor original que tenía el dado...
            // útil para calcular el score...
            const originalTypeDice: TypeDice = typeDice === 8 ? 1 : typeDice;

            newScoreMessage.value =
              originalTypeDice *
              (neighborsMerge.length + 1) *
              copyDiceDrag.totalMerges;
            /**
             * Se incrementa el valor del ítem que se había arrastrando,
             * por ejemplo si el valor del dado era 2, pasa a 3
             * esto con el fin de actualizar el valor y así hacer otra validación de merge
             */
            copyDiceDrag.dropDices[i].type = newDiceType;
            // Se incrementa el total de merges que se han lanzado en el mismo lanzamiento...
            copyDiceDrag.totalMerges++;
          } else {
            /**
             * Si el valor es mayor que 7, quiere decie que se debe eliminar,
             * ya que se ha hecho todos los merge posible...
             */
            copyGridData[diceRow][diceCol].dice.state = DiceState.DISAPEAR;
            // El valor a entregar es de 100
            newScoreMessage.value = SCORE_DICE_ALL;
          }

          newScoreMessage.x = diceSorted[i].x;
          newScoreMessage.y = diceSorted[i].y;

          break;
        }
      }
    }
  }

  if (!existsMerge && score.progress.value >= MAX_MERGES_NEXT_LEVEL) {
    nextLevel = true;
    copyScore.progress.level++;
    copyScore.progress.value = 0;

    savePropierties("score", {
      best: copyScore.score.best,
      score: copyScore.score.score,
      progress: copyScore.progress.value,
      level: copyScore.progress.level,
    });
  }

  return {
    existsMerge,
    copyGridData,
    copyDiceDrag,
    newScoreMessage,
    nextLevel,
    copyScore,
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

/**
 * Guarda el estado del juego en el localstorage,
 * no todo el estado, sólo lo necesario...
 * @param gridData
 * @param diceDrag
 */
export const updateGameStateCache = (
  gridData: GridType,
  diceDrag: DiceDrag
) => {
  const grid = convertGridHashTable(gridData);
  // Se obtienen sólo los valores necesario a almacenanar...
  const drag = { dices: diceDrag.dices, dir: diceDrag.orientation };

  // Se guarda la información en localStorage del estado del juego...
  saveMultiplePropierties({ grid, drag });
};

export const getInitialDragData = (gridData: GridType): DiceDrag => {
  const cachedDrag: { dices: TypeDice[]; dir: number } = getValueFromCache(
    "drag",
    { dices: [] }
  );

  // Se valida que existan dados
  // además que los dados estén en rango de dados permitidos...
  if (
    cachedDrag.dices.length !== 0 &&
    cachedDrag.dices.every((v) => v >= MIN_VALUE_DICE && v <= MAX_VALUE_DICE)
  ) {
    // Se retorna el valor de los dados de arrastre de la caché
    // Si el valor de orientación almacenado no es valido se
    // establece por defecto cero...
    return {
      dices: cachedDrag.dices,
      typeOrientation: cachedDrag.dices.length === 1 ? "SINGLE" : "MULTIPLE",
      orientation:
        cachedDrag.dir >= 0 && cachedDrag.dir <= 3 ? cachedDrag.dir : 0,
      isVisible: true,
      totalMerges: 1,
    };
  }

  return getDiceDrag(gridData);
};

/**
 * Para limpiar los mensajes de score, pasado un tiempo
 * @param scoreMessages
 * @returns
 */
export const clearNewScoreMessages = (scoreMessages: ScoreMessages[]) =>
  cloneDeep(scoreMessages).filter((v) => v.timeStamp >= new Date().getTime());

/**
 * Crear la información necesaria para mostrar el score en la grilla...
 * @param scoreMessages
 * @param newScoreMessage
 * @returns
 */
export const generateNewScoreMessages = (
  scoreMessages: ScoreMessages[],
  newScoreMessage: ScoreMessages
) => {
  const currentTime = new Date().getTime();
  // Se dejan sólo aquellos cuyo timeStamp sea mayor o igual que el tiempo actual...
  const copyScoreMessages = clearNewScoreMessages(scoreMessages);

  // Se le adiciona 5 segundos de vida al mensaje,
  // después de ese tiempo se debe eliminar del estado...
  const timeStamp = currentTime + 5000;
  copyScoreMessages.push({ ...newScoreMessage, timeStamp });

  return copyScoreMessages;
};

/**
 * Retorna la información inicial para el score del juego...
 * @returns
 */
export const getInitialScore = (): Score => {
  // Primero se lee la información que hay en LocalStorage...
  const cachedScore: CachedScore = getValueFromCache(
    "score",
    DEFAULT_SCORE_CACHE
  );

  return {
    score: {
      best: cachedScore.best || 0,
      score: cachedScore.score || 0,
      animate: false,
    },
    progress: {
      value: cachedScore.progress || 0,
      level: cachedScore.level || 0,
    },
  };
};

/**
 * Actualizar el score obtenido en el juego
 * @param score
 * @param scoreValue
 * @param progressValue
 * @returns
 */
export const updateScore = (
  score: Score,
  scoreValue: number,
  progressValue: number = 1
) => {
  const copyScore = cloneDeep(score);
  const newScore = copyScore.score.score + scoreValue;
  copyScore.score.score = newScore;

  if (newScore > copyScore.score.best) {
    copyScore.score.best = copyScore.score.score;
  }

  if (!copyScore.score.animate) {
    copyScore.score.animate = true;
  }

  copyScore.progress.value += progressValue;

  savePropierties("score", {
    best: copyScore.score.best,
    score: copyScore.score.score,
    progress: copyScore.progress.value,
    level: copyScore.progress.level,
  });

  return copyScore;
};

/**
 * Función que elimina la información del estado del juego
 * que estaba almacenada en localStorage...
 */
export const resetCachedGameState = () => {
  deleteProperty("grid");
  deleteProperty("drag");

  const cachedScore: CachedScore = getValueFromCache(
    "score",
    DEFAULT_SCORE_CACHE
  );

  savePropierties("score", { ...cachedScore, score: 0 });
};

/**
 * Obtener el estado inicial de las ayudas...
 * @returns
 */
export const getGameHelps = () =>
  Object.keys(TYPES_HELPS)
    .map((help, index) => {
      const type = help as TypeHelps;

      return {
        [type]: {
          index,
          icon: type.toLowerCase() as TypeIcon,
          remaining: getTotalHelp(type),
          type,
          selected: false,
        },
      };
    })
    .reduce((a, s) => ({ ...a, ...s }), {}) as HelpsGame;

interface ValidateUndo {
  gridData: GridType;
  helpsGame: HelpsGame;
  undo: UndoValues[];
  setDiceDrag: React.Dispatch<React.SetStateAction<DiceDrag>>;
  setGridData: React.Dispatch<React.SetStateAction<GridType>>;
  setHelpsGame: React.Dispatch<React.SetStateAction<HelpsGame>>;
  setScore: React.Dispatch<React.SetStateAction<Score>>;
  setUndo: React.Dispatch<React.SetStateAction<UndoValues[]>>;
}
/**
 * Valida el undo del juego...
 * @param param0
 */
export const validateUndo = ({
  gridData,
  helpsGame,
  undo,
  setDiceDrag,
  setGridData,
  setHelpsGame,
  setScore,
  setUndo,
}: ValidateUndo) => {
  const totalUndo = getTotalHelp(HELPS.UNDO);

  if (totalUndo > 0 && undo.length !== 0) {
    const copyUndo = cloneDeep(undo);
    const lastUndo = copyUndo.pop();

    if (lastUndo) {
      const { grid, score, drag } = lastUndo;
      const newGrid: GridType = [];

      // Crear los nuevos valores de la grilla...
      for (let i = 0; i < DIMENSION_GRID; i++) {
        newGrid[i] = [];

        for (let c = 0; c < DIMENSION_GRID; c++) {
          // Se crea el dado, si es que existe en la caché...
          const dice: DiceGrid | undefined = grid[`${i}-${c}`]
            ? {
                type: grid[`${i}-${c}`] as TypeDice,
                state: DiceState.VISIBLE,
                x: gridData[i][c].x,
                y: gridData[i][c].y,
              }
            : undefined;

          newGrid[i][c] = { ...gridData[i][c], dice };
        }
      }

      const newDiceDrag: DiceDrag = {
        dices: drag.dices,
        typeOrientation: drag.dices.length === 1 ? "SINGLE" : "MULTIPLE",
        orientation: drag.dir >= 0 && drag.dir <= 3 ? drag.dir : 0,
        isVisible: true,
        totalMerges: 1,
      };

      const newScore: Score = {
        score: {
          best: score.best,
          score: score.score,
          animate: true,
        },
        progress: {
          value: score.progress,
          level: score.level,
        },
      };

      const copyHelpsGame = cloneDeep(helpsGame);
      copyHelpsGame.UNDO.remaining--;

      setGridData(newGrid);
      setDiceDrag(newDiceDrag);
      setHelpsGame(copyHelpsGame);
      setScore(newScore);
      setUndo(copyUndo);

      // Guarda en localStorage...
      const newCacheHelps = getNewCacheHelps(copyHelpsGame);
      saveMultiplePropierties({
        helps: newCacheHelps,
        timestamp: getCurrentTimeStamp(),
        score: {
          best: newScore.score.best,
          score: newScore.score.score,
          progress: newScore.progress.value,
          level: newScore.progress.level,
        },
      });

      updateGameStateCache(newGrid, newDiceDrag);
    }
  }
};

interface ValidateTrash {
  gridData: GridType;
  helpsGame: HelpsGame;
  setDiceDrag: React.Dispatch<React.SetStateAction<DiceDrag>>;
  setHelpsGame: React.Dispatch<React.SetStateAction<HelpsGame>>;
}

/**
 * Valida la selección de la ayuda de cambiar de elementos a arrastrar (trash)...
 * @param param0
 */
export const validateTrash = ({
  gridData,
  helpsGame,
  setDiceDrag,
  setHelpsGame,
}: ValidateTrash) => {
  const totalTrash = getTotalHelp(HELPS.TRASH);

  if (totalTrash > 0) {
    const newDiceDrag = getDiceDrag(gridData);
    const copyHelpsGame = cloneDeep(helpsGame);

    copyHelpsGame.TRASH.remaining--;

    const newCacheHelps = getNewCacheHelps(copyHelpsGame);

    // Guarda en localStorage...
    saveMultiplePropierties({
      helps: newCacheHelps,
      timestamp: getCurrentTimeStamp(),
      drag: { dices: newDiceDrag.dices, dir: newDiceDrag.orientation },
    });

    setHelpsGame(copyHelpsGame);
    setDiceDrag(newDiceDrag);
  }
};

interface ValidateBomb {
  diceDrag: DiceDrag;
  helpsGame: HelpsGame;
  type: TypeHelps;
  setDiceDrag: React.Dispatch<React.SetStateAction<DiceDrag>>;
  setHelpsGame: React.Dispatch<React.SetStateAction<HelpsGame>>;
}

/**
 * Valida la selección de la ayuda de la bomba y la estrella...
 * @param param0
 */
export const validateSelectioBombAndStar = ({
  diceDrag,
  helpsGame,
  type,
  setDiceDrag,
  setHelpsGame,
}: ValidateBomb) => {
  const total = getTotalHelp(type);

  if (total > 0) {
    // Saber si estaba seleccionado...
    const copyHelpsGame = cloneDeep(helpsGame);
    const copyDiceDrag = cloneDeep(diceDrag);
    const isSelected = copyHelpsGame[type].selected;

    copyDiceDrag[type === HELPS.BOMB ? "isBomb" : "isStar"] = !isSelected;
    copyHelpsGame[type].selected = !isSelected;

    setDiceDrag(copyDiceDrag);
    setHelpsGame(copyHelpsGame);
  }
};

interface ValidateRemoveDiceWithBomb {
  diceDrag: DiceDrag;
  gridData: GridType;
  helpsGame: HelpsGame;
  over: string;
  setDiceDrag: React.Dispatch<React.SetStateAction<DiceDrag>>;
  setGridData: React.Dispatch<React.SetStateAction<GridType>>;
  setHelpsGame: React.Dispatch<React.SetStateAction<HelpsGame>>;
}

/**
 * Valida la acción de eliminar un dado en la grilla con una ayuda de tipo bomba
 * @param param0
 */
export const validateRemoveDiceWithBomb = ({
  diceDrag,
  gridData,
  helpsGame,
  over,
  setDiceDrag,
  setGridData,
  setHelpsGame,
}: ValidateRemoveDiceWithBomb) => {
  const [row, col] = over.split("-").map((v) => +v);

  /**
   * Validar que el valor de las posiciones estén en rango...
   */
  if (isRange(row, col)) {
    const diceRemove = gridData[row][col].dice;

    // Se valida que exista un dado en la posición dada...
    if (diceRemove) {
      const copyDiceDrag = cloneDeep(diceDrag);
      const copyGridData = cloneDeep(gridData);
      const copyHelpsGame = cloneDeep(helpsGame);

      // Se elimina el dado en la posición dada...
      copyGridData[row][col].dice = undefined;
      copyDiceDrag.isBomb = false;

      copyHelpsGame.BOMB.remaining--;
      // Se indica que ya no está seleccionada la bomba...
      copyHelpsGame.BOMB.selected = false;

      const newCacheHelps = getNewCacheHelps(copyHelpsGame);

      // Guarda en localStorage...
      saveMultiplePropierties({
        helps: newCacheHelps,
        timestamp: getCurrentTimeStamp(),
      });

      updateGameStateCache(copyGridData, copyDiceDrag);

      setDiceDrag(copyDiceDrag);
      setGridData(copyGridData);
      setHelpsGame(copyHelpsGame);
    }
  }
};
