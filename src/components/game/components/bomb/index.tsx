import "./styles.css";
import { SIZE_ITEM } from "../../../../utils/constants";
import imageBomb from "./bomb.png";
import React from "react";

const Bomb = () => (
  <img
    src={imageBomb}
    alt="Bomb"
    className="bomb-help"
    style={{ width: SIZE_ITEM, height: SIZE_ITEM }}
  />
);

export default React.memo(Bomb);
