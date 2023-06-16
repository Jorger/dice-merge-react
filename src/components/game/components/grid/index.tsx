import "./styles.css";
import React from "react";
import type { GridType } from "../../../../interfaces";
import { DiceState, POSICION_BASE_GRID } from "../../../../utils/constants";
import { Dice, GridItem } from "..";

interface GridPops {
  gridData: GridType;
}

const Grid = ({ gridData }: GridPops) => {
  return (
    <div className="grid-game" style={POSICION_BASE_GRID}>
      {gridData.map((row) =>
        row.map((item) => {
          if (item.dice && item.dice.state !== DiceState.GHOST) {
            return <Dice {...item.dice} key={item.index} />;
          }

          return <GridItem item={item} key={item.index} />;
        })
      )}
    </div>
  );
};

export default React.memo(Grid);
