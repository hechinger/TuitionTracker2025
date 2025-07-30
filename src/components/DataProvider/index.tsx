"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { StorageContext, useStorageContext } from "@/hooks/useStorageContext";
import { DataContext, type DataContextType } from "@/hooks/useDataContext";
import type { SchoolDetail } from "@/types";

const queryClient = new QueryClient();

/**
 * The DataProvider component provides a React context that is used throughout
 * the app by other components to access general-purpose, preloaded data.
 * 
 * @param props.locale
 *   The locale the user is currently viewing ("en" or "es")
 * @param props.schools
 *   An optional set of pre-loaded school data
 * @param props.content
 *   Content for the given locale
 * @param props.children
 *   Content to render inside the provider
 */
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
