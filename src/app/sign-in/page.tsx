import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignOutButton,
} from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <ClerkProvider>
      <SignedIn>
        <SignOutButton>
          <button>Sign out</button>
        </SignOutButton>
      </SignedIn>

      <SignedOut>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "10vh 0",
          }}
        >
          <SignIn
            withSignUp={false}
            routing="hash"
          />
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}
