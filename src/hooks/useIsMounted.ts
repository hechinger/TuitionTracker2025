import { useState, useEffect } from "react";

/**
 * Hook to tell a component whether or not it has mounted on the client
 * side (true only after the first render has completed).
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}