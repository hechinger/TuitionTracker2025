import type { SchoolIndex, SchoolControl, DegreeLevel } from "@/types";

export function getSchoolRoute(school: Pick<SchoolIndex, "slug">) {
  return `/schools/${school.slug}`;
}

export function getCompareRoute() {
  return `/saved-schools/`;
}

export const api = {
  index: () => "/api/schools",
  names: () => "/api/schools/names",
  priceHistogram: () => "/api/schools/price-histogram",
  sizeHistogram: ({
    schoolControl,
    degreeLevel,
  }: {
    schoolControl?: SchoolControl;
    degreeLevel?: DegreeLevel;
  } = {}) => {
    const base = "/api/schools/size-histogram"
    if (!schoolControl && !degreeLevel) return base;
    const q = new URLSearchParams();
    if (schoolControl) q.set("schoolControl", schoolControl);
    if (degreeLevel) q.set("degreeLevel", degreeLevel);
    return `${base}?${q}`;
  },
  school: (id: string) => `/api/schools/${id}`,
};
