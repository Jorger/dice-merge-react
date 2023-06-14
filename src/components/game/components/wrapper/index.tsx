import "./styles.css";
import React, { ReactNode } from "react";

const GameWrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[] | ReactNode;
}) => <div className="game-wrapper">{children}</div>;

export default React.memo(GameWrapper);
