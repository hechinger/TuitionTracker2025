import { createContext, useContext } from "react";

export type DataContextType = {
  locale: string;
  content?: Record<string, Record<string, string>>;
};

export const DataContext = createContext<DataContextType>({
  locale: "en",
  content: undefined,
});

export function useDataContext() {
  return useContext(DataContext);
}
