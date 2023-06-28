import "./styles.css";
import { SoundProvider } from "../../context/SoundContext";
import { useUpdateServiceWorker, useWindowResize } from "../../hooks";
import React from "react";
import AlertUpdateApp from "../alertUpdateApp";

const AppWrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const serviceWorkerInformation = useUpdateServiceWorker();
  useWindowResize();

  return (
    <SoundProvider>
      <div className="container">
        <div className="screen">
          {serviceWorkerInformation?.serviceWorkerUpdated && (
            <AlertUpdateApp
              serviceWorkerRegistration={
                serviceWorkerInformation.serviceWorkerRegistration
              }
            />
          )}
          {children}
        </div>
      </div>
    </SoundProvider>
  );
};

export default React.memo(AppWrapper);
