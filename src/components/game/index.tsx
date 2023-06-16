import { DragEventsType } from "../../interfaces";
import { delay } from "../../utils/helpers";
import { DragGrid, GameWrapper } from "./components";
import {
  clearGrid,
  getDiceDrag,
  initialGridData,
  putDiceOnGrid,
  rotateDiceDrag,
  validateMergeDice,
} from "./helpers";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!diceDrag.isVisible) {
      const runAsync = async () => {
        const { existsMerge, copyGridData, copyDiceDrag } = validateMergeDice({
          gridData,
          diceDrag,
        });

        console.log({ existsMerge });

        await delay(existsMerge ? 300 : 100);

        if (!existsMerge) {
          // Si no existe merge se limpia la grilla
          const {
            copyGridData: newGridData,
            isASpaceAvailable,
            isLastDiceMerge,
          } = clearGrid(gridData);

          console.log({ isASpaceAvailable, isLastDiceMerge });

          if (isLastDiceMerge) {
            await delay(500);
          }

          if (isASpaceAvailable) {
            const newDiceDrag = getDiceDrag(newGridData);
            setDiceDrag(newDiceDrag);
            setGridData(newGridData);
          } else {
            console.log("NO HAY ESPACIO DISPONIBLE, GAME OVER");
          }
        } else {
          setGridData(copyGridData);
          setDiceDrag(copyDiceDrag);
        }

        // console.log("un segundo después");
      };

      runAsync();
    }
  }, [diceDrag, gridData]);

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
