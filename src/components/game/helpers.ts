import type { GridType } from "../../interfaces";
import { DIMENSION_GRID, OFFSET_ITEM, SIZE_ITEM } from "../../utils/constants";

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
      };

      index++;
    }
  }

  return newGrid;
};
