"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { StorageContext, useStorageContext } from "@/hooks/useStorageContext";

const queryClient = new QueryClient();

export default function DataProvider(props: Readonly<{
  children: React.ReactNode;
}>) {
  const storageValue = useStorageContext();

  return (
    <QueryClientProvider client={queryClient}>
      <StorageContext.Provider value={storageValue}>
        {props.children}
      </StorageContext.Provider>
    </QueryClientProvider>
  );
}
