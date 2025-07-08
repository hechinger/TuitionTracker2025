import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignOutButton,
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
            <SignOutButton>
              <button>Sign out</button>
            </SignOutButton>
            <Dashboard content={content} />
          </SignedIn>

          <SignedOut>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SignIn
                withSignUp={false}
              />
            </div>
          </SignedOut>
        </Well>
      </DataProvider>
    </ClerkProvider>
  );
}
