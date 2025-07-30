import { createContext, useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { SavedSchools, IncomeBracket, IncomeBracketKey } from "@/types";

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
  const pathname = usePathname();
  const router = useRouter();

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
    const q = new URLSearchParams(window.location.search);
    const savedSchoolsParam = q.get("saved-schools");
    if (savedSchoolsParam) {
      try {
        setValue("savedSchools", JSON.parse(savedSchoolsParam));
      } catch(error) {
        console.error("Failed to load saved schools from query param", savedSchoolsParam);
        console.error(error);
      }
      const newQ = new URLSearchParams(q);
      newQ.delete("saved-schools");
      const newQString = `${newQ}`;
      router.replace(`${pathname}${newQString ? `?${newQString}` : ""}`);
    }

    setSavedSchools(getValue<string[]>("savedSchools") || []);
    setIncomeBracket(getValue<string>("incomeBracket"));
    setIsLoaded(true);
  }, [router, pathname]);

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
      bracket: incomeBracket as IncomeBracketKey,
      setIncomeBracket,
    },
  };
}
