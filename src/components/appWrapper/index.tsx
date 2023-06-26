import "./styles.css";
import { SoundProvider } from "../../context/SoundContext";
import { useWindowResize } from "../../hooks";
import React from "react";

const AppWrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  useWindowResize();

  return (
    <SoundProvider>
      <div className="container">
        <div className="screen">{children}</div>
      </div>
    </SoundProvider>
  );
};

export default React.memo(AppWrapper);
