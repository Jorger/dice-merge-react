import "./styles.css";
import { MAX_MERGES_NEXT_LEVEL } from "../../../../utils/constants";
import React from "react";

interface ProgressProps {
  value: number;
  level: number;
}

const Progress = ({ value = 0, level = 0 }: ProgressProps) => {
  const progressValue = +(value / MAX_MERGES_NEXT_LEVEL).toFixed(2) * 100;
  const progress = progressValue <= 100 ? progressValue : 100;

  return (
    <div className="progress-game">
      <div className="progress-game-wrapper">
        <div className="progress-game-level">{level}</div>
        <div className="progress-game-bar">
          <div
            className="progress-game-bar-value"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-game-level">{level + 1}</div>
      </div>
    </div>
  );
};

export default React.memo(Progress);
