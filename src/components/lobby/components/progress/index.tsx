import "./styles.css";
import { getValueFromCache } from "../../../../utils/storage";
import {
  DEFAULT_SCORE_CACHE,
  MAX_MERGES_NEXT_LEVEL,
} from "../../../../utils/constants";
import React from "react";
import type { CachedScore } from "../../../../interfaces";

const Progress = () => {
  const { level, progress }: CachedScore = getValueFromCache(
    "score",
    DEFAULT_SCORE_CACHE
  );

  const progressValue = +(progress / MAX_MERGES_NEXT_LEVEL).toFixed(2) * 100;
  const finalProgress = progressValue <= 100 ? progressValue : 100;

  return (
    <div className="progress-lobby">
      <div className="progress-lobby-level">{level}</div>
      <div className="progress-lobby-progress">
        <div
          className="progress-lobby-value"
          style={{ width: `${finalProgress}%` }}
        />
      </div>
    </div>
  );
};

export default React.memo(Progress);
