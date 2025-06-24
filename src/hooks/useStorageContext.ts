import { createContext, useState, useCallback, useEffect } from "react";
import { SavedSchools, IncomeBracket } from "@/types";

export const StorageContext = createContext({
  savedSchools: {
    schools: [],
    toggleSavedSchool: () => {},
    schoolIsSaved: () => false,
  } as SavedSchools,
  incomeBracket: {
    bracket: undefined,
    setIncomeBracket: () => {},
  } as IncomeBracket,
});

const getKey = (key: string) => `tuitionTracker.${key}`;

const getValue = <T>(key: string) => {
  const value = window.sessionStorage.getItem(getKey(key));
  if (!value) return undefined;
  return JSON.parse(value) as T;
};

const setValue = (key: string, value: unknown) => {
  if (value === undefined) {
    window.sessionStorage.removeItem(getKey(key));
  } else {
    window.sessionStorage.setItem(getKey(key), JSON.stringify(value));
  }
};

export function useStorageContext() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [savedSchools, setSavedSchools] = useState<string[]>([]);
  const toggleSavedSchool = useCallback((id: string) => {
    setSavedSchools((old) => {
      const isSaved = old.includes(id);
      const rest = old.filter((sid) => sid !== id);
      if (isSaved) return rest;
      return [id, ...rest];
    });
  }, []);
  const schoolIsSaved = useCallback((id: string) => {
    return savedSchools.includes(id);
  }, [savedSchools]);

  const [incomeBracket, setIncomeBracket] = useState<string>();

  // Load values from existing storage
  useEffect(() => {
    setSavedSchools(getValue<string[]>("savedSchools") || []);
    setIncomeBracket(getValue<string>("incomeBracket"));
    setIsLoaded(true);
  }, []);

  // Write new values back to storage
  useEffect(() => {
    if (!isLoaded) return;
    setValue("savedSchools", savedSchools);
    setValue("incomeBracket", incomeBracket);
  }, [isLoaded, savedSchools, incomeBracket]);

  return {
    savedSchools: {
      schools: savedSchools,
      toggleSavedSchool,
      schoolIsSaved,
    },
    incomeBracket: {
      bracket: incomeBracket,
      setIncomeBracket,
    },
  };
}
