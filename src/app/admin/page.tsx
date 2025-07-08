import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignOutButton,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { getContentForAdmin } from "@/db/content";
import DataProvider from "@/components/DataProvider";
import PageTopOverlap from "@/components/PageTopOverlap";
import Well from "@/components/Well";
import Dashboard from "@/admin/components/Dashboard";

export default async function Admin() {
  const content = await getContentForAdmin();

  return (
    <ClerkProvider>
      <DataProvider>
        <PageTopOverlap>
          <Well width="text">
            <h1>Tuition Tracker Admin</h1>
          </Well>
        </PageTopOverlap>
        <Well width="text">
          <SignedIn>
            <SignOutButton redirectUrl="/admin">
              <button>Sign out</button>
            </SignOutButton>
            <Dashboard content={content} />
          </SignedIn>

          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Well>
      </DataProvider>
    </ClerkProvider>
  );
}
