"use client";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import DataProvider from "@/components/DataProvider";
import AdminNav from "@/admin/components/AdminNav";

import "./global.scss";

// Font styles for MUI
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <DataProvider>
        <AdminNav />

        <SignedIn>
          {children}
        </SignedIn>

        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </DataProvider>
    </ClerkProvider>
  );
}
