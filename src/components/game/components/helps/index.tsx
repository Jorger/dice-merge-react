import "./styles.css";
import Icon from "../../../icon";
import React from "react";
import type { DiceDrag, HelpsGame, TypeHelps } from "../../../../interfaces";
import { HELPS } from "../../../../utils/constants";

interface HelpsProps {
  diceDrag: DiceDrag;
  helpsGame: HelpsGame;
  totalUndo: number;
  handleHelp: (type: TypeHelps) => void;
}

const Helps = ({
  diceDrag,
  helpsGame,
  totalUndo = 0,
  handleHelp,
}: HelpsProps) => (
  <div className="game-helps">
    <div className="game-helps-wrapper">
      {Object.keys(helpsGame).map((key) => {
        const help = helpsGame[key as TypeHelps];
        const isDisabledUndo = help.type === HELPS.UNDO && totalUndo === 0;

        const disabled =
          help.remaining <= 0 || !diceDrag.isVisible || isDisabledUndo;

        return (
          <button
            key={help.index}
            title={help.type}
            className={`button blue game-helps-${help.type.toLowerCase()}`}
            disabled={disabled}
            onClick={() => handleHelp(help.type)}
          >
            <Icon type={!help.selected ? help.icon : "close"} fill="white" />
            <span>{help.remaining}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default React.memo(Helps);
