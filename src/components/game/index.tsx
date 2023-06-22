import { delay } from "../../utils/helpers";
import {
  clearGrid,
  clearNewScoreMessages,
  generateNewScoreMessages,
  getDiceDrag,
  getGameHelps,
  getInitialDragData,
  getInitialScore,
  initialGridData,
  putDiceOnGrid,
  resetCachedGameState,
  rotateDiceDrag,
  updateGameStateCache,
  updateScore,
  validateMergeDice,
} from "./helpers";
import {
  DragEventsType,
  HelpsGame,
  Score,
  ScoreMessages,
  TypeHelps,
} from "../../interfaces";
import {
  DragGrid,
  GameOver,
  GameWrapper,
  Header,
  Helps,
  NextLevel,
  Progress,
} from "./components";
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
   * Estado que indica si se muestra o no el modal de nextLevel.
   */
  const [showNextLevel, setShowNextLevel] = useState(false);

  /**
   * Para el estado de gameover...
   */
  const [isGameOver, setIsGameOver] = useState(false);

  /**
   * Para guardar el score de la partida...
   */
  const [score, setScore] = useState<Score>(() => getInitialScore());

  /**
   * Para manejar las ayudas del juego... (setHelpsGame)
   */
  const [helpsGame] = useState<HelpsGame>(() => getGameHelps());

  useEffect(() => {
    if (!diceDrag.isVisible) {
      const runAsync = async () => {
        const {
          existsMerge,
          copyGridData,
          copyDiceDrag,
          newScoreMessage,
          nextLevel,
          copyScore,
        } = validateMergeDice({
          gridData,
          diceDrag,
          score,
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

          if (nextLevel) {
            setScore(copyScore);
            setShowNextLevel(true);
          }

          // Se valida si hay espacio en el board...
          if (isASpaceAvailable) {
            // Si es así se establecen los nuevos valores
            const newDiceDrag = getDiceDrag(newGridData);
            setDiceDrag(newDiceDrag);
            setGridData(newGridData);

            // Se debe guardar la data en localstorage...
            updateGameStateCache(newGridData, newDiceDrag);
          } else {
            // Se debe limpiar localstorage...
            resetCachedGameState();
            // Se debe mostrar que el juego ha acabado...
            setIsGameOver(true);
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

  const handleRestart = () => {
    resetCachedGameState();

    const newGridData = initialGridData();
    setGridData(newGridData);
    setDiceDrag(getDiceDrag(newGridData));
    setScore(getInitialScore());
    setIsGameOver(false);
  };

  const handleHelp = (type: TypeHelps) => {
    console.log({ type });
  };

  return (
    <GameWrapper>
      {showNextLevel && (
        <NextLevel
          level={score.progress.level}
          handleClose={() => setShowNextLevel(false)}
        />
      )}
      {isGameOver && (
        <GameOver {...score.score} handleRestart={handleRestart} />
      )}
      <Header
        {...score.score}
        handleOptions={() => console.log("MOSTRAR OPCIONES")}
      />
      <Progress {...score.progress} />
      <Helps
        diceDrag={diceDrag}
        helpsGame={helpsGame}
        handleHelp={handleHelp}
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
