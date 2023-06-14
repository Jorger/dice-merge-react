import { GameWrapper, Grid } from "./components";
import { initialGridData } from "./helpers";
import React, { useState } from "react";

const Game = () => {
  // setGridData
  /**
   * Guarda la información de la grilla...
   */
  const [gridData] = useState(() => initialGridData());

  return (
    <GameWrapper>
      <Grid gridData={gridData} />
    </GameWrapper>
  );
};

export default React.memo(Game);
