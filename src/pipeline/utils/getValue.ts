import get from "lodash/get";

export const getValue = (obj, path, defaultValue) => {
  if (typeof path === "function") {
    const v = path(obj);
    if (typeof v === "undefined") return defaultValue;
    return v;
  }
  return get(obj, path, defaultValue);
};
