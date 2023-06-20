import "./styles.css";
import { useInterval } from "../../../../hooks";
import React, { useEffect, useState } from "react";

interface ScoreCounterProps {
  animate?: boolean;
  className?: string;
  index?: number;
  intervalTime?: number;
  score: number;
  handleEndTimer?: (index?: number) => void;
}

const ScoreCounter = ({
  animate = true,
  className = "",
  index = 0,
  intervalTime = 30,
  score = 0,
  handleEndTimer,
}: ScoreCounterProps) => {
  const [initialScore, setinItialScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [finalScore, setFinalScore] = useState<{
    score: number;
    increase: number;
  }>({ score: 0, increase: 0 });

  /**
   * Efecto que se ejecuta cuando el valor del score cambia
   * Se valida si es difernete al score actual que tiene el componente
   */
  useEffect(() => {
    if (score !== finalScore.score) {
      setFinalScore({ score, increase: score > finalScore.score ? 1 : -1 });

      if (animate) {
        setIsRunning(true);
      } else {
        setinItialScore(score);
      }
    }
  }, [animate, finalScore, score]);

  useInterval(
    () => {
      const newInitialScore = initialScore + finalScore.increase;
      setinItialScore(newInitialScore);

      if (newInitialScore === finalScore.score) {
        setIsRunning(false);
        handleEndTimer && handleEndTimer(index);
      }
    },
    isRunning ? intervalTime : null
  );

  return (
    <div className={`${className} ${isRunning ? "score-counter" : ""}`}>
      {initialScore}
    </div>
  );
};

export default React.memo(ScoreCounter);
