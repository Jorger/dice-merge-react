import { Link } from "react-router-dom";
import "./styles.css";
import React from "react";
import Icon from "../../../icon";

const ToolBar = ({ handleShowOptions }: { handleShowOptions: () => void }) => {
  return (
    <div className="lobby-toolbar">
      <Link className="button blue" title="About" to="/about">
        <Icon type="info" fill="white" />
      </Link>
      <button className="button blue" title="Share">
        <Icon type="share" fill="white" />
      </button>
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
