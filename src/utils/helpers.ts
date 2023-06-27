export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export const isMobile = (): boolean =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const debounce = (fn: Function, delay: number) => {
  var t: number;
  return function () {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  };
};

/**
 * Devuleve un número "aleatorio", dado un rango...
 * @param min
 * @param max
 * @returns
 */
export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Establece una interrupción...
 * @param ms
 * @returns
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Valida si un string es un JSON valido...
 * @param json
 * @returns
 */
export const isValidJson = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Retorna el valor del día actual...
 * @returns
 */
export const getCurrentTimeStamp = () => {
  const date = new Date();

  const addZero = (value = 0) => (value <= 9 ? `0${value}` : value);

  const dateString = `${date.getFullYear()}-${addZero(
    date.getMonth() + 1
  )}-${addZero(date.getDate())}`;

  return new Date(dateString).getTime() / 1000;
};

/**
 * Valida si un TimeStamp es válido...
 * @param value
 * @returns
 */
export const isValidTimeStamp = (value: string | number) => {
  try {
    return new Date(value).getTime() > 0;
  } catch (_) {
    return false;
  }
};

/**
 * Copiar un texto en el portapapeles...
 * @param {*} text
 */
export const copyToClipboard = (text: string = "") => {
  navigator.clipboard.writeText(text);
};
