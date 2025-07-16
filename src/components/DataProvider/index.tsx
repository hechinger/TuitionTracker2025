"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { StorageContext, useStorageContext } from "@/hooks/useStorageContext";
import { DataContext, type DataContextType } from "@/hooks/useDataContext";
import type { SchoolDetail } from "@/types";

const queryClient = new QueryClient();

export default function DataProvider(props: Readonly<{
  locale?: string;
  schools?: Record<string, SchoolDetail>;
  content?: DataContextType["content"];
  children: React.ReactNode;
}>) {
  const storageValue = useStorageContext();
  const contextValue = {
    locale: props.locale || "en",
    content: props.content,
    schools: props.schools,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={contextValue}>
        <StorageContext.Provider value={storageValue}>
          {props.children}
        </StorageContext.Provider>
      </DataContext.Provider>
    </QueryClientProvider>
  );
}
