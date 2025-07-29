# Tuition Tracker 2025

This project contains all the font-end and back-end code for the Tuition Tracker built by The Hechinger Report.

**Tech stack**: Next.js 15, React, PostgreSQL (via Neon), Clerk (auth), next-intl (i18n), SCSS

> [! WARNING]
> If you are looking for the code from the original Tuition Tracker project, [that can be found here](https://github.com/hechinger/TuitionTracker).

## 🚀 Quick start

1. Clone the repo
2. Copy `env.example` to `.env.local` and fill in secrets
3. Run `npm install`
4. (Optional, requires local database setup) Bootstrap local data with `npm run bootstrap`
5. Run `npm run dev`
6. Open [localhost:3000](http://localhost:3000)

## ⚙️ Framework overview

This project is built with [Next.js](https://nextjs.org/) using the [App Router](https://nextjs.org/docs/app), which enables a file-based routing system along with support for layouts, nested routes, and React Server Components.

Key App Router concepts used in this project:

- **Dynamic Routes**: Routes that accept URL parameters, defined using square brackets (e.g., `src/app/[locale]/page.tsx`). [Learn more](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- **API Routes**: Serverless functions co-located in the `src/app/api/` directory to handle backend logic. [Learn more](https://nextjs.org/docs/app/building-your-application/routing/api-routes)
- **Server Components**: Components that render on the server by default, improving performance and reducing client-side JavaScript. [Learn more](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

If you're new to the App Router, you can start with the [App Router documentation overview](https://nextjs.org/docs/app/building-your-application/routing).

### Finding your way around

The code organization of this project is pretty standard for a Next project, but here are some important landmarks to get you oriented:

- Files in the `public/` directory get deployed and served as unchanged static files. This makes it a good place for things like `ads.txt` or other things like that, which you want to serve from the root of the site unchanged.

- All of the source code of the project lives in the `src/` directory, so that's where you'll likely spend most of your time doing any development work. Within `src/`:

  - The `app/` directory contains the project's file-based routing, defining which pages exist in the app and at what URL paths. Two things to point out within it: everything in `(redirects)` is handling redirects from legacy pages to their new versions, and everything in `[locale]` gets automatically internationalized with `next-intl`.

  - The `components/` directory contains all of the various components for the live site. These range from low-level utility components to components that render full sections of pages.

  - The `db/` directory contains helpers for accessing data from the database.

  - The `hooks/` directory contains custom hooks for use across the site. Note that some components have their own custom hooks co-located with their component code; in general, hooks that are not tied to one single component go in the `hooks/` directory, and hooks that are implementation details of single components live along side those components.

  - The `pipeline/` directory contains the fetching and parsing code for the data pipeline. This handles downloading bulk data from IPEDS, parsing it, performing any necessary analysis, and loading the results into the database.

  - The `styles/` directory contains mostly SCSS utilities that are used in stylesheets for components (e.g., color definitions).

  - The `types/` directory contains type definitions that are used throughout the codebase.

  - The `utils/` directory contains some basic utilities that are used throughout the codebase.

  - The `admin/` directory segments off code that is specific to the admin dashboard.

## 🔌 Third-Party tools

This project integrates most notably with the following external services/libraries:

- **[Clerk](https://clerk.com/)** for authentication and user management. Clerk handles sign-in, sign-up, and session management with full React and Next.js support. See their guide for integrating [Clerk + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs). Which routes are protected is determined in [`src/middleware.ts`](./src/middleware.ts).

- **[next-intl](https://next-intl-docs.vercel.app/)** for internationalization (i18n). This library provides a simple way to manage translations and locale-based routing in Next.js projects. Check out their guide for [integrating with next-intl](https://next-intl-docs.vercel.app/getting-started/app-router). Which routes are localized is determined in [`src/middleware.ts`](./src/middleware.ts). Note that all localized routes have to be under the [`src/app/[locale]/`](./src/app/[locale]) directory.

- **[Neon](https://neon.tech/)** as a fully managed PostgreSQL database. Neon supports serverless connections and works well with edge functions and modern hosting platforms like Vercel. Check out the [Neon Docs](https://neon.tech/docs/introduction). For the purposes of this project, we just treat it like a managed PostgreSQL database ([their web dashboard is pretty handy though](https://console.neon.tech/)).

- **[Vercel Blob](https://vercel.com/docs/vercel-blob)** for storing and serving uploaded images.

These services are configured primarily using environment variables and [`src/middleware.js`](./src/middleware.ts).

## Database structure

The database for this project consists of the following tables:

- `schools` contains all the metadata and school-level information for the school, including things like the school name, slug, enrollment numbers, graduation rates, and retention. This table gets loaded automatically by the data pipeline.

- `prices` contains all the historical price information broken down by school and by year. This includes sticker price as well as net prices for each income bracket. This table gets loaded automatically by the data pipeline.

- `national_averages` contains a set of national averages for retention and graduation rates for both 2-year and 4-year institutions. This table gets loaded automatically by the data pipeline.

- `content` contains all the configurable content of the site. Each bit of content has a `component` and `path` that, together, represent where that bit of content exists on the site (note that "component" here doesn't necessarily correspond exactly to components in the `src/components/` directory). Much of the content is localized, so there are entries for both English and Spanish.

- `recirculation_articles` contains the set of articles that are promoted in the recirculation module. It supports storing articles organized by the page in the app on which they should be promoted (the `page` column); articles with `page` set to `default` will be available for use on all pages, but articles with a specific page set (e.g., `landing`) will take priority on that specific page.

- `recommended_schools` contains the set of schools that are promoted on the landing page. These can be organized into multiple sections, each consisting of multiple schools.

- `recommended_school_ids` contains many-to-many relationships between the sections in `recommended_schools` and the `schools` table.

## Admin configuration

This project includes an admin dashboard section (mounted at the path `/admin`) in addition to the main, public pages of the site. All of the admin pages and endpoints are protected with Clerk, so you can manage which users have access through Clerk's web portal.

The admin dashboard lets users do a number of things, including:

- edit the text on the site;
- manage some top-level school metadata, like uploading school images;
- configure recommended schools on the landing page;
- control which articles are included in the recirculation module; and
- run the data pipeline to pull in new data.

### Managing content

One of the most expansive sections of the admin is the content editing section. The editable fields in the admin are configured in [`src/content/schema.ts`](./src/content/schema.ts), which contains a hierarchical structure of field configurations. You can reorganize fields as you see fit by reordering and regrouping fields in the schema file.

Each field in the content schema controls one or two rows in the `content` table, depending on if the content is localized or not. There are some things (like image URLs) that don't require translation, but most of the dynamic content is translated text. The `path` in the schema file is the combination of the `component` and `path` columns of the `content` table.

The dynamic content can be used on the front-end by calling the `useContent()` hook to get a content lookup function. That function accepts a path, as found in the schema file, and returns the correct bit of text based on the user's current locale, meaning it returns Spanish in the Spanish version of the site, and English in the English version. If the piece of content is not localized, it returns the same value regardless of the user's locale.

This means that in order to add a new piece of content to the site and make it editable, you have to:

- add a field with a unique `path` to the schema, enabling users to edit the content through the admin dashboard, then
- consume and render that piece of content in a component, like so (assuming `"new.content.path"` is the new path you set up in the schema):
  ```ts
  const content = useContent();
  content("new.content.path"); // returns the stored content
  ```

## IPEDS data pipeline

This app provides an automated data pipeline for downloading bulk data from IPEDS, processing it, and loading it into the database. IPEDS provides [bulk data files](https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx?gotoReportId=7&fromIpeds=true&sid=f4816230-1dce-424f-9fef-73d4260c6c68&rtid=7), which we download, parse, and synthesize into our internal representation of the data for a school. This includes some specific analysis, like calculating graduation or retention rates, or projecting future years of price data.

You can find the relevant code in the [`src/pipeline/`](./src/pipeline) directory. Refer to the comments in the code for more information on how it works.

## Caching

This project leverages Vercel's edge caching to provide a quick and speedy user experience. Because the site's content is primarily static and will likely change very infrequently, we set agressive cache times on most of the endpoints (with the exception of admin-related endpoints, which should have a tiny amount of traffic) and explicitly invalidate endpoints when content changes.

Note that Vercel's cache can be purged through the Vercel admin, and each deployment on Vercel has its own set of cache keys, so if for some reason you find content stuck in Vercel's cache and you need to remove it quickly, you can either purge manually or promote a new deployment to production. In theory that shouldn't be necessary, but good to know as a last resort.

When any content or data changes, usually because someone at The Hechinger Report updated something in the admin tool, we invalidate the corresponding routes in [`src/cache.ts`](./src/cache.ts). Note that if we add new routes in the future, we will need to make sure to invalidate them as necessary when data changes.

## Local development

This project was built using Node v22.12 for local development, but most modern versions of Node should work. Install dependencies:

```bash
npm install
```

Set up a local `.env` file with the following configurations, providing the necessary values (you can start from [`env.example`](./env.example)):

```bash
DATABASE_URL="<YOUR DB URL>"
BLOB_READ_WRITE_TOKEN="<VERCEL BLOB TOKEN>"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<PUBLISHABLE KEY FROM CLERK>"
CLERK_SECRET_KEY="<SECRET KEY FROM CLERK>"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
VERCEL_ENV="development"
```

For local development, especially if you're doing something that requires updating content, you may want to use a local database (e.g., run a local postgres server). The project should have a separate Vercel blob storage set up for the preview and development environments. You should be able to retrieve the corresponding token to use as `BLOB_READ_WRITE_TOKEN` for local development.

If you're getting things started for the first time, you can bootstrap a local database. Note that this will truncate some tables to maintain its idempotency in a local environment, so **use caution if you are connected to a production database**. Double-check your database configuration just be be sure. (Also note that this pulls a lot of data, so it may take a few minutes to complete.)

```bash
npm run bootstrap
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

This project is [deployed through Vercel](https://vercel.com/hechingers-projects/tuition-tracker-2025). You can create new deployments from the command line using the [Vercel CLI](https://vercel.com/docs/cli). You can either [install it globally](https://vercel.com/docs/cli#installing-vercel-cli) or run it with [`npx`](https://docs.npmjs.com/cli/v8/commands/npx) as shown below. If you are deploying the project for the first time from your machine, you will have to log into Vercel:

```bash
npx vercel login
```

Then you'll need to make sure the local repo is linked to [the Hechinger `tuition-tracker-2025`](https://vercel.com/hechingers-projects/tuition-tracker-2025) project:

```bash
npx vercel link
```

Select the correct organization (`Hechinger`) and project (`tuition-tracker-2025`).

Finally, you can create new preview deployments:

```bash
npx vercel
```

Or production deployments, which will publish a new version of the site live to the world:

```bash
npx vercel --prod
```

Note that once you have created a preview deployment, you can also promote it to production through [the Vercel deployments dashboard](https://vercel.com/hechingers-projects/tuition-tracker-2025/deployments).

## Credit

This project was originally built by [The Andrew McGill Company](https://www.mcgill.cool/) :heart:
