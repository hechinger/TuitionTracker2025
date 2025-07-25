import type { MetadataRoute } from "next";
import { getAllSchoolNames } from "@/db/schools";

// Edit this to change the `lastMod` in the sitemap
const lastModified = new Date("2025-08-01T09:34:05.522Z");

const baseUrl = "https://tuitiontracker.org/";
const localizedRoutes = [
  "",
  "saved-schools",
  "search",
];

const getRoute = ({
  route,
  localized,
}: {
  route: string;
  localized?: boolean;
}) => {
  const base = {
    url: new URL(route, baseUrl).href,
    lastModified,
    changeFrequency: 'yearly' as const,
    priority: 1,
  };
  if (!localized) return base;
  const esUrl = new URL("es/", baseUrl).href;
  return {
    ...base,
    alternates: {
      languages: {
        es: new URL(route, esUrl).href,
      },
    },
  };
};
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const names = await getAllSchoolNames();

  // basic routes
  const routes = localizedRoutes.map((route) => getRoute({
    route,
    localized: true,
  }));

  // school-specific routes
  names.forEach((school) => {
    routes.push(getRoute({
      route: `schools/${school.slug}`,
      localized: true,
    }));
  });

  // game of college
  routes.push(getRoute({ route: "game-of-college" }));

  return routes;
}
