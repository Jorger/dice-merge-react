// https://codesandbox.io/s/3zddk?file=/src/index.tsx:757-811
import { useEffect, useRef } from "react";

interface IUseInterval {
  (callback: () => void, interval: number | null): void;
}

const useInterval: IUseInterval = (callback, interval) => {
  const savedCallback = useRef<(() => void) | null>(null);
  // After every render, save the latest callback into our ref.
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (interval !== null) {
      let id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
  }, [interval]);
};

export default useInterval;
