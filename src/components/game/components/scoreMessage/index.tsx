import "./styles.css";
import { delay } from "../../../../utils/helpers";
import { SIZE_ITEM } from "../../../../utils/constants";
import React, { useEffect, useState } from "react";
import type { ScoreMessages } from "../../../../interfaces";

interface ScoreMessageProps {
  score: ScoreMessages;
}

const ScoreMessage = ({ score }: ScoreMessageProps) => {
  const [stateMessage, setStateMessage] = useState<"show" | "hide" | "remove">(
    "show"
  );

  /**
   * Efecto que establece los estados
   */
  useEffect(() => {
    const runAsync = async () => {
      await delay(800);
      setStateMessage("hide");
      await delay(1200);
      setStateMessage("remove");
    };

    runAsync();
  }, []);

  return stateMessage !== "remove" ? (
    <div
      className={`score-message-grid ${stateMessage}`}
      style={{
        left: score.x,
        top: score.y - SIZE_ITEM / 1.5,
        width: SIZE_ITEM,
        height: SIZE_ITEM,
      }}
    >
      +{score.value}
    </div>
  ) : null;
};

export default React.memo(ScoreMessage);
