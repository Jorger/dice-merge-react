import "./styles.css";
import { DICE_NAMES, DiceState, SIZE_ITEM } from "../../../../utils/constants";
import Icon from "../../../icon";
import React from "react";
import type { DiceStateType, TypeDice } from "../../../../interfaces";

interface DiceProps {
  type: TypeDice;
  state?: DiceStateType;
  size?: number;
  x?: number;
  y?: number;
}

const Dice = ({
  type = 1,
  state = DiceState.APPEAR,
  size = SIZE_ITEM,
  x = 0,
  y = 0,
}: DiceProps) => {
  const className = `dice ${DICE_NAMES[
    type - 1
  ].toLowerCase()} ${state.toLowerCase()}`;

  const style = { width: size, height: size, left: x, top: y };

  return (
    <div className={className} style={style}>
      {type === 8 && <Icon type="star" fill="white" />}
    </div>
  );
};

export default React.memo(Dice);
