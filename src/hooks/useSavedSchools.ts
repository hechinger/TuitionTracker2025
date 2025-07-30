import { useContext } from "react";
import { StorageContext } from "./useStorageContext";

export function useSavedSchools() {
  const { savedSchools } = useContext(StorageContext);
  return savedSchools;
}
