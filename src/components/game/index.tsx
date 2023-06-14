import { DragGrid, GameWrapper } from "./components";
import { getDiceDrag, initialGridData, rotateDiceDrag } from "./helpers";
import React, { useState } from "react";

const Game = () => {
  // setGridData
  /**
   * Guarda la información de la grilla...
   */
  const [gridData] = useState(() => initialGridData());

  /**
   * Estado para el elemento que se está arrastrando (drag...)
   */
  const [diceDrag, setDiceDrag] = useState(() => getDiceDrag(gridData));

  const handleRotate = () => {
    setDiceDrag(rotateDiceDrag(diceDrag));
  };

  return (
    <GameWrapper>
      <DragGrid
        diceDrag={diceDrag}
        gridData={gridData}
        onRotate={handleRotate}
      />
      {/* <Grid gridData={gridData} /> */}
    </GameWrapper>
  );
};

export default React.memo(Game);
