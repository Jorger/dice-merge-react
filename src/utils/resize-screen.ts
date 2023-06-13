import { $, isMobile, debounce } from "./helpers";
import { BASE_WIDTH, BASE_HEIGHT } from "./constants";

const resizeScreen = debounce(() => {
  const bodyElement = $("body") as HTMLBodyElement;
  let scale = Math.min(
    window.innerWidth / BASE_WIDTH,
    window.innerHeight / BASE_HEIGHT
  );

  const mobile = isMobile();

  if (scale >= 1 || mobile) {
    scale = !mobile ? (scale > 1.1 ? 1 : scale) : 1;
  }

  let applyZoom =
    window.innerWidth < BASE_WIDTH
      ? Math.round((window.innerWidth / BASE_WIDTH) * 100)
      : 100;

  bodyElement.setAttribute(
    "style",
    `zoom: ${applyZoom}%; transform: scale(${scale});`
  );
}, 100);

export default resizeScreen;
