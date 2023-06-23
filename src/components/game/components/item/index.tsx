import "./styles.css";
import { Dice } from "..";
import { DiceState } from "../../../../utils/constants";
import { useDroppable } from "@dnd-kit/core";
import React from "react";
import type { GridItemType } from "../../../../interfaces";

interface GridItemProps {
  item: GridItemType;
  isBomb?: boolean;
}

const GridItem = ({ item, isBomb = false }: GridItemProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${item.row}-${item.col}`,
  });

  return !isBomb || (isBomb && item.dice) ? (
    <div
      ref={setNodeRef}
      className={`grid-item ${isOver && isBomb ? "isOver" : ""}`}
      style={{
        position: "absolute",
        width: item.size,
        height: item.size,
        left: item.x,
        top: item.y,
      }}
    >
      {item.dice && (item.dice.state === DiceState.GHOST || isBomb) && (
        <Dice
          state={!isBomb ? DiceState.GHOST : DiceState.VISIBLE}
          type={item.dice.type}
        />
      )}
    </div>
  ) : null;
};

export default React.memo(GridItem);
