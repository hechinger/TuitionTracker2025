import { useCallback } from "react";
import get from "lodash/get";

type Gtag = (...args: unknown[]) => void;

export function useGtag() {
  return useCallback((...args: unknown[]) => {
    const gtag = get(window, "gtag") as unknown as Gtag;
    gtag(...args);
  }, []);
}
