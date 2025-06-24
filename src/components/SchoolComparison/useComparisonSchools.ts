import { useState, useMemo, useCallback } from "react";
import { useSchools } from "@/hooks/useSchools";
import { useSavedSchools } from "@/hooks/useSavedSchools";
import { isNotUndefined } from "@/utils/isNotUndefined";
import type { SchoolIndex } from "@/types";

export function useComparisonSchools() {
  const savedSchools = useSavedSchools();

  const [compareSchoolIds, setCompareSchoolIds] = useState<string[]>([]);
  const setCompareIds = useCallback((ids: string[]) => {
    const newIds = [...new Set(ids)].slice(0, 3);
    setCompareSchoolIds(newIds);
  }, []);
  const clearCompareIds = useCallback(() => {
    setCompareSchoolIds([]);
  }, []);

  const {
    data: schools = [],
  } = useSchools();

  const schoolsById = useMemo(() => {
    const byId = new Map<string, SchoolIndex>();
    schools.forEach((school) => {
      byId.set(school.id, school);
    });
    return byId;
  }, [schools]);

  const compareSchools = compareSchoolIds
    .map((id) => schoolsById.get(id))
    .filter(isNotUndefined);

  const optionSchools = savedSchools.schools
    .filter((id) => {
      if (compareSchoolIds.includes(id)) return false;
      return true;
    })
    .map((id) => schoolsById.get(id))
    .filter(isNotUndefined);

  return {
    savedSchools,
    schools,
    schoolsById,
    compareSchools,
    setCompareIds,
    clearCompareIds,
    optionSchools,
  };
}
