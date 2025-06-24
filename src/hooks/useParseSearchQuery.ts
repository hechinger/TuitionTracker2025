import { useSearchParams } from "next/navigation";
import type { SchoolSearchParams } from "./useCreateSearchQuery";

const parseSchoolType = (
  schoolType: Partial<SchoolSearchParams["schoolType"]> | undefined,
) => {
  if (!schoolType) {
    return {
      public: true,
      private: true,
      forprofit: true,
    };
  }

  const allFalse = {
    public: false,
    private: false,
    forprofit: false,
  };
  return {
    ...allFalse,
    ...schoolType,
  };
};

export function useParseSearchQuery() {
  const q = useSearchParams();

  const {
    where = "",
    schoolType,
  } = JSON.parse(q.get("search") || "{}");

  return {
    where,
    schoolType: parseSchoolType(schoolType),
  };
}
