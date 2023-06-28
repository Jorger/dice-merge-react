import { useEffect, useState } from "react";
import type { IServiceWorker } from "../interfaces";

const useUpdateServiceWorker = () => {
  const [serviceWorkerInformation, setServiceWorkerInformation] =
    useState<IServiceWorker>({});

  useEffect(() => {
    /**
     * Función que se ejecuta cuando ha detectado un cambio en el service worker
     * @param event
     */
    const handleChangeServiceWorker = (
      event: CustomEvent<{ type: string; payload: ServiceWorkerRegistration }>
    ) => {
      setServiceWorkerInformation((data) => {
        let newData = {};

        if (event.detail.type === "SW_INIT") {
          newData = {
            ...data,
            serviceWorkerInitialized: !data.serviceWorkerInitialized,
          };
        } else {
          newData = {
            ...data,
            serviceWorkerUpdated: !data.serviceWorkerUpdated,
            serviceWorkerRegistration: event.detail.payload,
          };
        }

        return newData;
      });
    };

    document.addEventListener(
      "changeServiceWorker",
      handleChangeServiceWorker as EventListener
    );

    return () => {
      document.removeEventListener(
        "changeServiceWorker",
        handleChangeServiceWorker as EventListener
      );
    };
  }, []);

  return serviceWorkerInformation;
};

export default useUpdateServiceWorker;
