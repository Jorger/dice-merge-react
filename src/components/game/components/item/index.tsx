import React from "react";
import type { GridItemType } from "../../../../interfaces";

interface GridItemProps {
  item: GridItemType;
}

const GridItem = ({ item }: GridItemProps) => {
  return (
    <div
      style={{
        border: "1px solid red",
        position: "absolute",
        width: item.size,
        height: item.size,
        left: item.x,
        top: item.y,
      }}
    />
  );
};

export default React.memo(GridItem);
