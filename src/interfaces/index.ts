import { TypeIcon } from "../components/icon";
import { DiceState, DragEvents, HELPS } from "../utils/constants";

export type TypeDice = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type TypeHelps = keyof typeof HELPS;

export type DiceStateType = keyof typeof DiceState;

// export type DirectionRotationType = keyof typeof DirectionRotation;

export interface DiceGrid {
  type: TypeDice;
  state: DiceStateType;
  x: number;
  y: number;
}
export interface GridItemType {
  index: number;
  dice?: DiceGrid;
  row: number;
  col: number;
  size: number;
  x: number;
  y: number;
}

export type GridType = GridItemType[][];

export type DragEventsType = keyof typeof DragEvents;

export type TypeOrientation = "SINGLE" | "MULTIPLE";

export interface RenderDices {
  type: TypeDice;
  x: number;
  y: number;
  row: number;
  col: number;
}

export interface DiceDrag {
  dices: TypeDice[];
  typeOrientation: TypeOrientation;
  orientation: number;
  isVisible: boolean;
  totalMerges: number;
  dropDices?: RenderDices[];
  isBomb?: boolean;
  isStar?: boolean;
}

export interface OrientationParent {
  width: number;
  height: number;
  left: number;
  bottom: number;
}

export interface OrientationDice {
  x: number;
  y: number;
}

export interface OrientationPosition {
  parent: OrientationParent;
  dice: OrientationDice[];
}

export type Orientation = Record<TypeOrientation, OrientationPosition[]>;

export type Neighbors = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";

export interface ScoreMessages {
  value: number;
  timeStamp: number;
  x: number;
  y: number;
}

export interface Score {
  score: {
    best: number;
    score: number;
    animate: boolean;
  };
  progress: {
    value: number;
    level: number;
  };
}

export interface CachedScore {
  best: number;
  score: number;
  progress: number;
  level: number;
}

export type AmbientSounds = "click" | "rotate" | "merge" | "final";

export type SoundsType = "sound" | "music";

export type Sounds = Record<SoundsType, boolean>;

export interface SoundContextProps {
  soundEnabled: Sounds;
  toggleSound: (type: SoundsType) => void;
  playSound: (type: AmbientSounds) => void;
}

export type TotalMaxHelps = Record<TypeHelps, number>;

export interface HelpsGameOptions {
  index: number;
  icon: TypeIcon;
  remaining: number;
  type: TypeHelps;
  selected: boolean;
}

export type HelpsGame = Record<TypeHelps, HelpsGameOptions>;

export interface UndoValues {
  score: {
    score: number;
    best: number;
    progress: number;
    level: number;
  };
  grid: Record<string, number>;
  drag: {
    dices: TypeDice[];
    dir: number;
  };
}

export interface IServiceWorker {
  serviceWorkerInitialized?: boolean;
  serviceWorkerUpdated?: boolean;
  serviceWorkerRegistration?: ServiceWorkerRegistration;
}
