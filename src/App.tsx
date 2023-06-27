import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppWrapper from "./components/appWrapper";
import Loading from "./components/loading";
import React, { Suspense, lazy } from "react";

const AboutPage = lazy(() => import("./pages/about"));
const GamePage = lazy(() => import("./pages/game"));
const LobbyPage = lazy(() => import("./pages/lobby"));

const App = () => (
  <AppWrapper>
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LobbyPage />} />
          <Route path="/" index element={<LobbyPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </AppWrapper>
);

export default React.memo(App);
