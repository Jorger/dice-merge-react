import { DragEventsType } from "../../interfaces";
import { DragGrid, GameWrapper } from "./components";
import {
  getDiceDrag,
  initialGridData,
  putDiceOnGrid,
  rotateDiceDrag,
} from "./helpers";
import React, { useState } from "react";

const Game = () => {
  // setGridData
  /**
   * Guarda la información de la grilla...
   */
  const [gridData, setGridData] = useState(() => initialGridData());

  /**
   * Estado para el elemento que se está arrastrando (drag...)
   */
  const [diceDrag, setDiceDrag] = useState(() => getDiceDrag(gridData));

  const handleRotate = () => {
    setDiceDrag(rotateDiceDrag(diceDrag));
  };

  const handleDragEvent = (typeEvent: DragEventsType, over: string) => {
    putDiceOnGrid({
      diceDrag,
      gridData,
      over,
      typeEvent,
      setDiceDrag,
      setGridData,
    });
  };

  return (
    <GameWrapper>
      <DragGrid
        diceDrag={diceDrag}
        gridData={gridData}
        onRotate={handleRotate}
        onDragEvent={handleDragEvent}
      />
    </GameWrapper>
  );
};

export default React.memo(Game);
