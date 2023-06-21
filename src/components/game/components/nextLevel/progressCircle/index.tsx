import "./styles.css";
import { useInterval } from "../../../../../hooks";
import React, { useState } from "react";

const ProgressCircle = ({ level = 1 }: { level: number }) => {
  const [progress, setProgress] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [localLevel, setLocalLevel] = useState(level);

  useInterval(
    () => {
      const newProgress = progress + 1;
      setProgress(newProgress);

      if (newProgress === 100) {
        setIsRunning(false);
        setLocalLevel(localLevel + 1);
      }
    },
    isRunning ? 10 : null
  );

  return (
    <div className="progress-circle-wrapper">
      <div
        className="progress-circle"
        style={
          {
            "--progress": `${Math.round(360 * (progress / 100))}deg`,
          } as React.CSSProperties
        }
      />
      <div className="progress-circle-value">
        <span
          className={`progress-circle-value-progress ${
            !isRunning ? "next" : ""
          }`}
        >
          {localLevel}
        </span>
      </div>
    </div>
  );
};

export default React.memo(ProgressCircle);
