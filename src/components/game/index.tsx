import { DragEventsType, Score, ScoreMessages } from "../../interfaces";
import { delay } from "../../utils/helpers";
import { DragGrid, GameWrapper, Header } from "./components";
import {
  clearGrid,
  clearNewScoreMessages,
  generateNewScoreMessages,
  getDiceDrag,
  getInitialDragData,
  getInitialScore,
  initialGridData,
  putDiceOnGrid,
  rotateDiceDrag,
  updateGameStateCache,
  updateScore,
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
  const [diceDrag, setDiceDrag] = useState(() => getInitialDragData(gridData));

  /**
   * Para los mensajes de score que se muestran en la grilla...
   */
  const [scoreMessages, setScoreMessages] = useState<ScoreMessages[]>([]);

  /**
   * Para guardar el score de la partida...
   */
  const [score, setScore] = useState<Score>(() => getInitialScore());

  useEffect(() => {
    if (!diceDrag.isVisible) {
      const runAsync = async () => {
        const { existsMerge, copyGridData, copyDiceDrag, newScoreMessage } =
          validateMergeDice({
            gridData,
            diceDrag,
            // score,
          });

        // console.log("newScoreMessage", newScoreMessage);
        await delay(existsMerge ? 300 : 100);

        if (!existsMerge) {
          // Si no existe merge se limpia la grilla
          const {
            copyGridData: newGridData,
            isASpaceAvailable,
            isLastDiceMerge,
          } = clearGrid(gridData);

          if (isLastDiceMerge) {
            await delay(500);
          }

          // Se limpian los mensajes que puedan existir en la grilla...
          setScoreMessages((data) => clearNewScoreMessages(data));

          // Se valida si hay espacio en el board...
          if (isASpaceAvailable) {
            // Si es así se establecen los nuevos valores
            const newDiceDrag = getDiceDrag(newGridData);
            setDiceDrag(newDiceDrag);
            setGridData(newGridData);

            // Se debe guardar la data en localstorage...
            updateGameStateCache(newGridData, newDiceDrag);
          } else {
            console.log("NO HAY ESPACIO DISPONIBLE, GAME OVER");
          }
        } else {
          // Se crea un nuevo mensaje que indica el merge
          setScoreMessages((data) =>
            generateNewScoreMessages(data, newScoreMessage)
          );

          setScore((data) => updateScore(data, newScoreMessage.value));

          setGridData(copyGridData);
          setDiceDrag(copyDiceDrag);
        }

        // console.log("un segundo después");
      };

      runAsync();
    }
  }, [diceDrag, gridData, score]);

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
      <Header
        {...score.score}
        handleOptions={() => console.log("MOSTRAR OPCIONES")}
      />
      <DragGrid
        diceDrag={diceDrag}
        gridData={gridData}
        scoreMessages={scoreMessages}
        onRotate={handleRotate}
        onDragEvent={handleDragEvent}
      />
    </GameWrapper>
  );
};

export default React.memo(Game);
