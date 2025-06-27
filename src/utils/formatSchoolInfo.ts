import type { SchoolControl, DegreeLevel, SchoolDetail } from "@/types";

export function formatSchoolControl(control: SchoolControl) {
  const labels = {
    public: "Public",
    private: "Private",
    "for-profit": "For-profit",
  };
  return labels[control];
}

export function formatDegreeLevel(level: DegreeLevel) {
  const labels = {
    "4-year": "4-year",
    "2-year": "2-year",
  };
  return labels[level];
}

export function getGraduation(school: SchoolDetail) {
  if (school.degreeLevel === "2-year") {
    return school.graduationAssociates;
  }
  return school.graduationBachelors;
}
