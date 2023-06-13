import { useEffect } from "react";
import onWindowResize from "../utils/resize-screen";

const useWindowResize = () => {
  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    onWindowResize();

    document.addEventListener("contextmenu", (e) => e.preventDefault(), false);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
};

export default useWindowResize;
