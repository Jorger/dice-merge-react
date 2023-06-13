import React from "react";
import type {
  CachedScore,
  Neighbors,
  Orientation,
  TotalMaxHelps,
  TypeDice,
} from "../interfaces";

export const IS_CHROME = navigator.userAgent.match(/Chrome\/\d+/) !== null;
export const BASE_HEIGHT = 732;
export const BASE_WIDTH = 412;
export const DIMENSION_GRID = 5;
export const SIZE_ITEM = 63;
export const OFFSET_ITEM = 4;
export const GRID_SIZE =
  (SIZE_ITEM + OFFSET_ITEM) * DIMENSION_GRID + OFFSET_ITEM;

export const MIN_VALUE_DICE: TypeDice = 1;
export const MAX_VALUE_DICE: TypeDice = 8;
export const MIN_VALUE_MERGE = 3;
export const SCORE_DICE_ALL = 100;
export const MAX_MERGES_NEXT_LEVEL = 40;

// Para las posiciones base del elemento drag...
export const BASE_LEFT_DRAG = Math.round((BASE_WIDTH - SIZE_ITEM * 2) / 2);
export const BASE_BOTTOM_DRAG = SIZE_ITEM;

// Determina la posición de la grilla en el escenario...
export const POSICION_BASE_GRID: React.CSSProperties = {
  width: GRID_SIZE,
  height: GRID_SIZE,
  left: (BASE_WIDTH - GRID_SIZE) / 2,
  top: Math.round(BASE_HEIGHT * 0.2),
};

export const DEFAULT_SCORE_CACHE: CachedScore = {
  best: 0,
  score: 0,
  progress: 0,
  level: 0,
};

export enum DiceState {
  "VISIBLE" = "VISIBLE",
  "APPEAR" = "APPEAR",
  "GHOST" = "GHOST",
  "SHAKE" = "SHAKE",
  "HIDE" = "HIDE",
  "DISAPEAR" = "DISAPEAR",
}

export enum HELPS {
  "UNDO" = "UNDO",
  "TRASH" = "TRASH",
  "BOMB" = "BOMB",
  "STAR" = "STAR",
}

export const DICE_NAMES = [
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "ALL",
  "STAR",
];

export const TYPES_HELPS: TotalMaxHelps = {
  UNDO: 5,
  TRASH: 5,
  BOMB: 3,
  STAR: 3,
};

/**
 * Para el array que contiene los dados, en este caso el
 * valor de 7 no se tiene en cuenta, ni tampoco el especial 8,
 * sólo los valores de 1 - 6
 */
export const DICES_VALUES = new Array(MAX_VALUE_DICE - 2)
  .fill(null)
  .map((_, i) => (i + 1) as TypeDice);

export const DRAG_ORIENTATION: Orientation = {
  SINGLE: [
    {
      parent: {
        width: SIZE_ITEM,
        height: SIZE_ITEM,
        left: Math.round(BASE_LEFT_DRAG + SIZE_ITEM / 2),
        bottom: Math.round(BASE_BOTTOM_DRAG + SIZE_ITEM / 2),
      },
      dice: [
        {
          x: 0,
          y: 0,
        },
      ],
    },
  ],
  MULTIPLE: [
    {
      parent: {
        width: SIZE_ITEM,
        height: SIZE_ITEM * 2,
        left: Math.round(BASE_LEFT_DRAG + SIZE_ITEM / 2),
        bottom: BASE_BOTTOM_DRAG,
      },
      dice: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 0,
          y: SIZE_ITEM,
        },
      ],
    },
    {
      parent: {
        width: SIZE_ITEM * 2,
        height: SIZE_ITEM,
        left: BASE_LEFT_DRAG,
        bottom: Math.round(BASE_BOTTOM_DRAG + SIZE_ITEM / 2),
      },
      dice: [
        {
          x: SIZE_ITEM,
          y: 0,
        },
        {
          x: 0,
          y: 0,
        },
      ],
    },
    {
      parent: {
        width: SIZE_ITEM,
        height: SIZE_ITEM * 2,
        left: Math.round(BASE_LEFT_DRAG + SIZE_ITEM / 2),
        bottom: BASE_BOTTOM_DRAG,
      },
      dice: [
        {
          x: 0,
          y: SIZE_ITEM,
        },
        {
          x: 0,
          y: 0,
        },
      ],
    },
    {
      parent: {
        width: SIZE_ITEM * 2,
        height: SIZE_ITEM,
        left: BASE_LEFT_DRAG,
        bottom: Math.round(BASE_BOTTOM_DRAG + SIZE_ITEM / 2),
      },
      dice: [
        {
          x: 0,
          y: 0,
        },
        {
          x: SIZE_ITEM,
          y: 0,
        },
      ],
    },
  ],
};

export enum DragEvents {
  "OVER" = "OVER",
  "END" = "END",
}

export const NEIGHBOR_POSITIONS: Record<
  Neighbors,
  { row: number; col: number }
> = {
  TOP: {
    row: 0,
    col: -1,
  },
  RIGHT: {
    row: 1,
    col: 0,
  },
  BOTTOM: {
    row: 0,
    col: 1,
  },
  LEFT: {
    row: -1,
    col: 0,
  },
};

document.documentElement.style.setProperty("--base-height", `${BASE_HEIGHT}px`);
document.documentElement.style.setProperty("--base-width", `${BASE_WIDTH}px`);
