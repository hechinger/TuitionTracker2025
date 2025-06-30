import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import us from "us";
import { getSchoolRoute } from "@/utils/routes";
import type { SchoolIndex } from "@/types";

export type Suggestion<Type = "school" | "state"> = {
  type: Type;
  value: string;
  label: string;
};

export type SuggestionSet = {
  states: Suggestion<"state">[];
  schools: Suggestion<"school">[];
};

export function useSuggestions(opts: {
  value: string;
  schools: SchoolIndex[];
}) {
  const [suggestions, setSuggestions] = useState<SuggestionSet>({
    states: [],
    schools: [],
  });

  useEffect(() => {
    const getSuggestions = () => {
      const search = opts.value.toLowerCase();

      if (!search || search.length < 3) {
        return {
          states: [],
          schools: [],
        };
      }

      const matchingStates = [] as Suggestion<"state">[];
      us.STATES.forEach((state) => {
        if (!state.name.toLowerCase().includes(search)) return;
        matchingStates.push({
          type: "state",
          value: state.abbr,
          label: state.name,
        });
      });

      const matchingSchools = [] as Suggestion<"school">[];
      opts.schools.forEach((school) => {
        const schoolSearch = `${school.name} ${school.alias}`.toLowerCase();
        if (!schoolSearch.includes(search)) return;
        matchingSchools.push({
          type: "school",
          value: getSchoolRoute(school),
          label: school.name,
        });
      });

      return {
        states: matchingStates.sort((a, b) => a.label.localeCompare(b.label)),
        schools: matchingSchools.sort((a, b) => a.label.localeCompare(b.label)),
      };
    };

    const updateSuggestions = debounce(() => {
      setSuggestions(getSuggestions());
    }, 500);

    updateSuggestions();
  }, [opts.value, opts.schools]);

  return suggestions;
}
