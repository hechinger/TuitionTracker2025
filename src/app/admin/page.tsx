import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { getContentForAdmin } from "@/db/content";
import DataProvider from "@/components/DataProvider";
import Dashboard from "@/admin/components/Dashboard";

// Font styles for MUI
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default async function Admin() {
  const content = await getContentForAdmin();

  return (
    <ClerkProvider>
      <DataProvider>
        <SignedIn>
          <Dashboard content={content} />
        </SignedIn>

        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </DataProvider>
    </ClerkProvider>
  );
}
