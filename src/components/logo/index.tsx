import "./styles.css";
import { DiceState } from "../../utils/constants";
import Dice from "../game/components/dice";
import React from "react";

const Logo = () => (
  <div className="logo-game">
    <div className="logo-game-title">
      <span>DICE</span>
      <span>MERGE</span>
    </div>
    <div className="logo-game-dices">
      <Dice type={1} state={DiceState.VISIBLE} x={-10} y={80} />
      <Dice type={7} state={DiceState.VISIBLE} x={210} />
    </div>
  </div>
);

export default React.memo(Logo);
