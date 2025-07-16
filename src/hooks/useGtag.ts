import { useCallback } from "react";

export function useGtag() {
  return useCallback((...args: unknown[]) => {
    window.gtag(...args);
  }, []);
}
