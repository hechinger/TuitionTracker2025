import { createContext, useContext } from "react";
import type { SchoolDetail } from "@/types";

export type DataContextType = {
  locale: string;
  content?: Record<string, Record<string, string>>;
  schools?: Record<string, SchoolDetail>;
};

export const DataContext = createContext<DataContextType>({
  locale: "en",
  content: undefined,
  schools: undefined,
});

export function useDataContext() {
  return useContext(DataContext);
}
