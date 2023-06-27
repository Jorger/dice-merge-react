import "./styles.css";
import { ScoreCounter } from "..";
import { useNavigate } from "react-router-dom";
import FocusTrap from "focus-trap-react";
import Icon from "../../../icon";
import React from "react";

const RenderValues = ({
  label = "",
  value = 0,
  animate = true,
}: {
  label: string;
  value: number;
  animate?: boolean;
}) => {
  return (
    <div className="game-over-value">
      <div className="game-over-value-label">{label}</div>
      <ScoreCounter
        score={value}
        className="game-over-value-value"
        animate={animate}
        intervalTime={3}
      />
    </div>
  );
};

interface GameOverProps {
  best: number;
  score: number;
  handleRestart: () => void;
}

const GameOver = ({ score = 0, best = 0, handleRestart }: GameOverProps) => {
  const naviate = useNavigate();

  return (
    <FocusTrap focusTrapOptions={{ escapeDeactivates: false }}>
      <div className="game-over-wrapper">
        <div className="game-over-container">
          <h2 className="game-over-label">Game Over</h2>
          <div className="game-over-score">
            <RenderValues label="Score" value={score} />
            <RenderValues label="Best" value={best} animate={score >= best} />
          </div>
          <div className="game-over-buttons">
            <button
              className="button blue game-over-button"
              onClick={() => naviate("/")}
            >
              <Icon type="home" fill="white" />
              <span>Home</span>
            </button>
            <button
              className="button blue game-over-button"
              onClick={handleRestart}
            >
              <Icon type="restart" fill="white" />
              <span>Restart</span>
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default React.memo(GameOver);
