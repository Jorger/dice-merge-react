import "./styles.css";
import Icon from "../../../icon";
import React from "react";
import type { DiceDrag, HelpsGame, TypeHelps } from "../../../../interfaces";

interface HelpsProps {
  diceDrag: DiceDrag;
  helpsGame: HelpsGame;
  handleHelp: (type: TypeHelps) => void;
}

const Helps = ({ diceDrag, helpsGame, handleHelp }: HelpsProps) => (
  <div className="game-helps">
    <div className="game-helps-wrapper">
      {Object.keys(helpsGame).map((key) => {
        const help = helpsGame[key as TypeHelps];

        const disabled = help.remaining <= 0 || !diceDrag.isVisible;

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
