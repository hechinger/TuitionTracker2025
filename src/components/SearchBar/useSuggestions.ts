import { useMemo } from "react";
import us from "us";
import { getSchoolRoute } from "@/utils/routes";
import type { SchoolIndex } from "@/types";

export type Suggestion = {
  type: "school" | "state";
  value: string;
  label: string;
};

export function useSuggestions(opts: {
  value: string;
  schools: SchoolIndex[];
}) {
  const suggestions = useMemo(() => {
    const search = opts.value.toLowerCase();

    if (!search) return [];

    const matchingOptions = [] as Suggestion[];

    us.STATES.forEach((state) => {
      if (!state.name.toLowerCase().includes(search)) return;
      matchingOptions.push({
        type: "state",
        value: state.abbr,
        label: state.name,
      });
    });

    opts.schools.forEach((school) => {
      const schoolSearch = `${school.name} ${school.alias}`.toLowerCase();
      if (!schoolSearch.includes(search)) return;
      matchingOptions.push({
        type: "school",
        value: getSchoolRoute(school),
        label: school.name,
      });
    });

    return matchingOptions.sort((a, b) => a.label.localeCompare(b.label));
  }, [opts.value, opts.schools]);

  return suggestions;
}
