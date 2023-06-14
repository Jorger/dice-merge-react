import "./styles.css";
import React from "react";
import type { GridType } from "../../../../interfaces";
import { POSICION_BASE_GRID } from "../../../../utils/constants";
import { GridItem } from "..";

interface GridPops {
  gridData: GridType;
}

const Grid = ({ gridData }: GridPops) => {
  // console.log("GRID: gridData", gridData);

  return (
    <div className="grid-game" style={POSICION_BASE_GRID}>
      {gridData.map((row) =>
        row.map((item) => {
          return <GridItem item={item} key={item.index} />;
        })
      )}
    </div>
  );
};

export default React.memo(Grid);
