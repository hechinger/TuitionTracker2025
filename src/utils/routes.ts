import type { SchoolIndex } from "@/types";

export function getSchoolRoute(school: SchoolIndex) {
  return `/schools/${school.slug}`;
}

export function getCompareRoute() {
  return `/saved-schools/`;
}

export const api = {
  index: () => '/api/schools/',
  // index: () => '/api-static/schools_index.json',
  names: () => '/api/schools/names/',
  school: (id: string) => `/api/schools/${id}/`,
  // school: (id: string) => `/api-static/split/school_${id}.json`,
};
