import type { SchoolIndex } from "@/types";

export function getSchoolRoute(school: SchoolIndex) {
  return `/schools/${school.slug}-${school.id}`;
}

export const api = {
  // index: () => '/api/schools/',
  index: () => '/api-static/schools_index.json',
  // school: (id: string) => `/api/schools/${id}/`,
  school: (id: string) => `/api-static/split/school_${id}.json`,
};
