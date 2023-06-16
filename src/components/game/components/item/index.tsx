import React from "react";
import type { GridItemType } from "../../../../interfaces";
import { useDroppable } from "@dnd-kit/core";
import { DiceState } from "../../../../utils/constants";
import { Dice } from "..";

interface GridItemProps {
  item: GridItemType;
}

const GridItem = ({ item }: GridItemProps) => {
  // isOver
  const { setNodeRef } = useDroppable({
    id: `${item.row}-${item.col}`,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        width: item.size,
        height: item.size,
        left: item.x,
        top: item.y,
      }}
    >
      {item.dice && item.dice.state === DiceState.GHOST && (
        <Dice state={DiceState.GHOST} type={item.dice.type} />
      )}
    </div>
  );
};

export default React.memo(GridItem);
