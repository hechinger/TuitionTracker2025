import { useContext } from "react";
import { StorageContext } from "./useStorageContext";

export function useIncomeBracket() {
  const { incomeBracket } = useContext(StorageContext);
  return incomeBracket;
}
