import "./styles.css";
import FocusTrap from "focus-trap-react";
import React from "react";
import ProgressCircle from "./progressCircle";

interface NextLevelProps {
  level: number;
  handleClose: () => void;
}

const NextLevel = ({ level, handleClose }: NextLevelProps) => (
  <FocusTrap focusTrapOptions={{ escapeDeactivates: false }}>
    <div className="next-level-game">
      <div className="next-level-game-container">
        <h2>Level Up</h2>
        <div className="next-level-game-wrapper">
          <ProgressCircle level={level - 1} />
          <button className="button blue" onClick={handleClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  </FocusTrap>
);

export default React.memo(NextLevel);
