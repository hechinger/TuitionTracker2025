import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createI18nMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const i18nMiddleware = createI18nMiddleware(routing);

const privateRoutes = [
  "/(admin)(.*)",
];
const isPrivateRoute = createRouteMatcher(privateRoutes);

const i18nRoutes = [
  "/",
  "/(en|es)/:path*",
  "/(search|saved-schools)",
  "/schools/:path*",
];
const isI18nRoute = createRouteMatcher(i18nRoutes);

export default clerkMiddleware((auth, req) => {
  if (isPrivateRoute(req)) {
    auth.protect();
  }
  if (isI18nRoute(req)) {
    return i18nMiddleware(req);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    ...privateRoutes,
    ...i18nRoutes,
  ],
};
