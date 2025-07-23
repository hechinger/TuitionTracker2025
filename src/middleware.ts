import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createI18nMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// The i18n middleware from next-intl handles redirecting to the correct
// locale based on a user's preferences and rendering pages with an
// optoinal locale prefix.
const i18nMiddleware = createI18nMiddleware(routing);

// These route patters require a user to be authenticated with Clerk
const isPrivateRoute = createRouteMatcher([
  "/(admin)(.*)",
  "/api/admin/(.*)",
]);

// These route patterns will be localized with next-intl
const isI18nRoute = createRouteMatcher([
  "/",
  "/(en|es)/:path*",
  "/(search|saved-schools)",
  "/schools/:path*",
]);

export default clerkMiddleware(async (auth, req) => {
  // If this is a private route and a user isn't signed in, we're going
  // to redirect them to the sign-in page
  if (isPrivateRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({
        returnBackUrl: req.url,
      });
    }
  }

  // If this is localized route, we're going to handle localizing it here
  if (isI18nRoute(req)) {
    return i18nMiddleware(req);
  }

  // At this point there's nothing else we need to do for this route
});

// This sets up which routes our middleware will run on. NOTE: all of the
// private and localized route patterns above _must_ be included in this
// set of routes as well.
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/(admin)(.*)",
    "/",
    "/(en|es)/:path*",
    "/(search|saved-schools)",
    "/schools/:path*",
  ],
};
