import "./styles.css";
import React from "react";
import type { IServiceWorker } from "../../interfaces";

const AlertUpdateApp = (props: IServiceWorker) => {
  /**
   * Función que actualiza el service worker
   */
  const updateServiceWorker = () => {
    const registrationWaiting =
      props.serviceWorkerRegistration?.waiting || false;

    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: "SKIP_WAITING" });

      registrationWaiting.addEventListener("statechange", (e) => {
        if ((e.target as ServiceWorker).state === "activated") {
          window.location.reload();
        }
      });
    }
  };

  return (
    <div className="alert-update-app">
      <div className="alert-update-app-wrapper">
        <div className="alert-update-app-message">
          There is a new version Available{" "}
          <span
            role="img"
            aria-label="New version"
            className="alert-update-app-emoji"
          >
            🚀
          </span>
        </div>
        <button className="alert-update-button" onClick={updateServiceWorker}>
          Update
        </button>
      </div>
    </div>
  );
};

export default React.memo(AlertUpdateApp);
