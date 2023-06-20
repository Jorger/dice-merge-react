import "./styles.css";
import { ScoreCounter } from "..";
import Icon from "../../../icon";
import React from "react";

interface HeaderProps {
  animate: boolean;
  best: number;
  score: number;
  handleOptions: () => void;
}

const RenderScore = ({
  value = 0,
  label = "",
  animate = false,
}: {
  value: number;
  label: string;
  animate: boolean;
}) => (
  <div className="header-game-score">
    <div className="header-game-score-label">{label}</div>
    <ScoreCounter
      score={value}
      animate={animate}
      className="header-game-score-value"
    />
  </div>
);

const Header = ({
  animate = false,
  best = 0,
  score = 0,
  handleOptions,
}: HeaderProps) => (
  <div className="header-game">
    <div className="header-game-wrapper">
      <button className="button blue header-game-buttons" title="Back">
        <Icon type="back" fill="white" />
      </button>
      <div className="header-game-scores">
        <RenderScore label="Best" value={best} animate={animate} />
        <RenderScore label="Score" value={score} animate={animate} />
      </div>
      <button
        className="button blue header-game-buttons"
        title="Options"
        onClick={handleOptions}
      >
        <Icon type="gear" fill="white" />
      </button>
    </div>
  </div>
);

export default React.memo(Header);
