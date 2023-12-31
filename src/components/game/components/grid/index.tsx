import "./styles.css";
import { Dice, GridItem, ScoreMessage } from "..";
import { DiceState, POSICION_BASE_GRID } from "../../../../utils/constants";
import React from "react";
import type { GridType, ScoreMessages } from "../../../../interfaces";

interface GridPops {
  gridData: GridType;
  isBomb?: boolean;
  scoreMessages: ScoreMessages[];
}

const Grid = ({ gridData, isBomb = false, scoreMessages = [] }: GridPops) => (
  <div className="grid-game" style={POSICION_BASE_GRID}>
    {gridData.map((row) =>
      row.map((item) => {
        if (item.dice && item.dice.state !== DiceState.GHOST && !isBomb) {
          return <Dice {...item.dice} key={item.index} />;
        }

        return <GridItem item={item} key={item.index} isBomb={isBomb} />;
      })
    )}
    {/* Renderizar los mensajes del score */}
    {scoreMessages.map((score) => (
      <ScoreMessage score={score} key={score.timeStamp} />
    ))}
  </div>
);

export default React.memo(Grid);
