import "./index.css";
import * as serviceWorker from "./serviceWorkerRegistration";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log(
  `%cGame developed by Jorge Rubiano.
    You can find me at:
    * Twitter : https://twitter.com/ostjh
    * Github : https://github.com/jorger
    * Linkedin : https://www.linkedin.com/in/jorge-rubiano-a8616319`,
  "color:red; font-size:20px; font-weight: bold; -webkit-text-stroke: 1px black; border-radius:10px; padding: 20px; background-color: black;"
);

serviceWorker.register({
  onSuccess: () => {
    const event = new CustomEvent("changeServiceWorker", {
      detail: { type: "SW_INIT" },
    });
    document.dispatchEvent(event);
  },
  onUpdate: (registration) => {
    const event = new CustomEvent("changeServiceWorker", {
      detail: {
        type: "SW_UPDATE",
        payload: registration,
      },
    });
    document.dispatchEvent(event);
  },
});
