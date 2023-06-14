import AppWrapper from "./components/appWrapper";
import Game from "./components/game";
import React from "react";

const App = () => {
  return (
    <AppWrapper>
      <Game />
    </AppWrapper>
  );
};

export default React.memo(App);
