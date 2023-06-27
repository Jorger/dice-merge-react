import { Link } from "react-router-dom";
import "./styles.css";
import React from "react";
import Icon from "../../../icon";
import Share from "../../../share";

const ToolBar = ({ handleShowOptions }: { handleShowOptions: () => void }) => {
  const dataShare = {
    title: "Dice Puzzle",
    text: "Come and play Dice Puzzle, a game developed by Jorge Rubiano @ostjh",
    url: window.location.origin,
  };

  return (
    <div className="lobby-toolbar">
      <Link className="button blue" title="About" to="/about">
        <Icon type="info" fill="white" />
      </Link>
      <Share data={dataShare}>
        <button className="button blue" title="Share">
          <Icon type="share" fill="white" />
        </button>
      </Share>
      <button
        className="button blue"
        title="Options"
        onClick={handleShowOptions}
      >
        <Icon type="gear" fill="white" />
      </button>
    </div>
  );
};

export default React.memo(ToolBar);
