import get from "lodash/get";

export function googletag() {
  return get(window, "googletag")
}
