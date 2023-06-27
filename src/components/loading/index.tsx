import "./styles.css";
import React from "react";

const Loading = () => (
  <div className="lds-ring">
    {new Array(4).fill(null).map((_, key) => (
      <div key={key} />
    ))}
  </div>
);

export default React.memo(Loading);
