import Loading from "../components/loading";
import React, { Suspense, lazy } from "react";

const Game = lazy(() => import("../components/game"));

const GamePage = () => (
  <Suspense fallback={<Loading />}>
    <Game />
  </Suspense>
);

export default React.memo(GamePage);
