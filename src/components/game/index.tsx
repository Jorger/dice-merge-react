import { delay } from "../../utils/helpers";
import { DragEvents, HELPS } from "../../utils/constants";
import { useSoundContext } from "../../context/SoundContext";
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
  validateRemoveDiceWithBomb,
  validateSelectioBombAndStar,
  validateTrash,
  validateUndo,
} from "./helpers";
import {
  DragEventsType,
  HelpsGame,
  Score,
  ScoreMessages,
  TypeHelps,
  UndoValues,
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
import Options from "../options";
import React, { useEffect, useState } from "react";

const Game = () => {
  const { playSound } = useSoundContext();
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
  const [helpsGame, setHelpsGame] = useState<HelpsGame>(() => getGameHelps());

  /**
   * Guarda la información relacionada al undo del juego...
   */
  const [undo, setUndo] = useState<UndoValues[]>([]);

  /**
   * Para mostrar las opciones del juego...
   */
  const [showOptions, setShowOptions] = useState(false);

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

        await delay(existsMerge ? 300 : 100);

        if (!existsMerge) {
          // Si no existe merge se limpia la grilla
          const {
            copyGridData: newGridData,
            isASpaceAvailable,
            isLastDiceMerge,
          } = clearGrid(gridData);

          if (isLastDiceMerge) {
            playSound("final");
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
          playSound("merge");
        }
      };

      runAsync();
    }
  }, [diceDrag, gridData, playSound, score]);

  const handleRotate = () => {
    setDiceDrag(rotateDiceDrag(diceDrag));
    playSound("rotate");
  };

  /**
   * Función que escucha las acciones de drag...
   * @param typeEvent
   * @param over
   */
  const handleDragEvent = (typeEvent: DragEventsType, over: string) => {
    if (!diceDrag.isBomb) {
      putDiceOnGrid({
        diceDrag,
        gridData,
        helpsGame,
        over,
        score,
        typeEvent,
        undo,
        setDiceDrag,
        setGridData,
        setHelpsGame,
        setUndo,
      });
    }

    if (diceDrag.isBomb && typeEvent === DragEvents.END && over !== "") {
      validateRemoveDiceWithBomb({
        diceDrag,
        gridData,
        helpsGame,
        over,
        setDiceDrag,
        setGridData,
        setHelpsGame,
      });
    }
  };

  const handleRestart = () => {
    resetCachedGameState();

    const newGridData = initialGridData();
    setGridData(newGridData);
    setDiceDrag(getDiceDrag(newGridData));
    setScore(getInitialScore());
    setIsGameOver(false);
    setShowOptions(false);
    setUndo([]);
  };

  /**
   * Función que ejecuta las acciones para cada ayuda...
   * @param type
   */
  const handleHelp = (type: TypeHelps) => {
    if (type === HELPS.UNDO) {
      validateUndo({
        gridData,
        helpsGame,
        undo,
        setDiceDrag,
        setGridData,
        setHelpsGame,
        setScore,
        setUndo,
      });
    }

    if (type === HELPS.TRASH) {
      validateTrash({
        gridData,
        helpsGame,
        setDiceDrag,
        setHelpsGame,
      });
    }

    if (type === HELPS.BOMB || type === HELPS.STAR) {
      validateSelectioBombAndStar({
        diceDrag,
        helpsGame,
        type,
        setDiceDrag,
        setHelpsGame,
      });
    }
  };

  return (
    <GameWrapper>
      {showOptions && (
        <Options
          handleClose={() => setShowOptions(false)}
          handleRestart={handleRestart}
        />
      )}
      {showNextLevel && (
        <NextLevel
          level={score.progress.level}
          handleClose={() => setShowNextLevel(false)}
        />
      )}
      {isGameOver && (
        <GameOver {...score.score} handleRestart={handleRestart} />
      )}
      <Header {...score.score} handleOptions={() => setShowOptions(true)} />
      <Progress {...score.progress} />
      <Helps
        diceDrag={diceDrag}
        helpsGame={helpsGame}
        totalUndo={undo.length}
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
