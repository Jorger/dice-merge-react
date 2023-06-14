import AppWrapper from "./components/appWrapper";
import Dice from "./components/dice";
import React from "react";
import type { TypeDice } from "./interfaces";
import { SIZE_ITEM } from "./utils/constants";

const App = () => {
  return (
    <AppWrapper>
      <>
        {new Array(6).fill(null).map((_, i) => {
          return <Dice key={i} x={i * SIZE_ITEM} type={(i + 1) as TypeDice} />;
        })}
        <Dice type={7} x={0} y={SIZE_ITEM} />
        <Dice type={8} x={SIZE_ITEM} y={SIZE_ITEM} />
        <Dice type={6} x={SIZE_ITEM * 2} y={SIZE_ITEM} state="GHOST" />
        <Dice type={1} x={SIZE_ITEM * 3} y={SIZE_ITEM} state="DISAPEAR" />
        <Dice type={4} x={SIZE_ITEM * 4} y={SIZE_ITEM} state="HIDE" />
        <Dice type={5} x={SIZE_ITEM * 5} y={SIZE_ITEM} state="SHAKE" />
      </>
    </AppWrapper>
  );
};

export default React.memo(App);
