## ⚙️ Framework Overview

This project is built with [Next.js](https://nextjs.org/) using the [App Router](https://nextjs.org/docs/app), which enables a file-based routing system along with support for layouts, nested routes, and React Server Components.

Key App Router concepts used in this project:

- **Dynamic Routes**: Routes that accept URL parameters, defined using square brackets (e.g., `src/app/[locale]/page.tsx`). [Learn more](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- **API Routes**: Serverless functions co-located in the `src/app/api/` directory to handle backend logic. [Learn more](https://nextjs.org/docs/app/building-your-application/routing/api-routes)
- **Server Components**: Components that render on the server by default, improving performance and reducing client-side JavaScript. [Learn more](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

If you're new to the App Router, you can start with the [App Router documentation overview](https://nextjs.org/docs/app/building-your-application/routing).

## 🔌 Third-Party Tools

This project integrates most notably with the following external services/libraries:

- **[Clerk](https://clerk.com/)** for authentication and user management. Clerk handles sign-in, sign-up, and session management with full React and Next.js support. See their guide for integrating [Clerk + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs). Which routes are protected is determined in `src/middleware.ts`.

- **[next-intl](https://next-intl-docs.vercel.app/)** for internationalization (i18n). This library provides a simple way to manage translations and locale-based routing in Next.js projects. Check out their guide for [integrating with next-intl](https://next-intl-docs.vercel.app/getting-started/app-router). Which routes are localized is determined in `src/middleware.ts`. Note that all localized routes have to be under the `src/app/[locale]/` directory.

- **[Neon](https://neon.tech/)** as a fully managed PostgreSQL database. Neon supports serverless connections and works well with edge functions and modern hosting platforms like Vercel. Check out the [Neon Docs](https://neon.tech/docs/introduction). For the purposes of this project, we just treat it like a managed PostgreSQL database ([their web dashboard is pretty handy though](https://console.neon.tech/)).

These services are configured primarily using environment variables and `src/middleware.js`.

## Local Development

This project was built using Node v22.12 for local development, but most modern versions of Node should work. Install dependencies:

```bash
npm install
```

Set up a local `.env` file with the following configurations, providing the necessary values:

```bash
DATABASE_URL="<YOUR DB URL>"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<PUBLISHABLE KEY FROM CLERK>"
CLERK_SECRET_KEY="<SECRET KEY FROM CLERK>"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
BLOB_READ_WRITE_TOKEN="<VERCEL BLOB TOKEN>"
```

For local development, especially if you're doing something that requires updating content, you may want to use a local database (e.g., run a local postgres server).

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

This project is deployed through Vercel. New preview deployments are automatically created from pushes to GitHub.
