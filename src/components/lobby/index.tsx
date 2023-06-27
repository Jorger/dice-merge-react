import "./styles.css";
import { BestScore, Progress, ToolBar } from "./components";
import { Link } from "react-router-dom";
import Logo from "../logo";
import Options from "../options";
import React, { useState } from "react";

const Lobby = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="lobby-page">
      {showOptions && <Options handleClose={() => setShowOptions(false)} />}
      <Logo />
      <div>
        <Progress />
        <BestScore />
      </div>
      <Link className="lobby-page-play" to="/game">
        Play
      </Link>
      <ToolBar handleShowOptions={() => setShowOptions(true)} />
    </div>
  );
};

export default React.memo(Lobby);
