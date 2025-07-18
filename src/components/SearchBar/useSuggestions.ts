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

/**
 * Use the current state of the "where" search input to build a set of matching
 * suggestions to show in the search drop-down. This includes both states and
 * school names that match the current search input.
 * 
 * @param opts.value
 *   The current input value of the "where" search input, used to filter
 *   matching results.
 * @param opts.schools
 *   The set of schools to match against.
 */
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

      // We only want to find matches once we have some meaningful input
      if (!search || search.length < 3) {
        return {
          states: [],
          schools: [],
        };
      }

      // Collect the matching state names
      const matchingStates = [] as Suggestion<"state">[];
      us.STATES.forEach((state) => {
        if (!state.name.toLowerCase().includes(search)) return;
        matchingStates.push({
          type: "state",
          value: state.abbr,
          label: state.name,
        });
      });

      // Collect the matching school names
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

    // Debounce our rebuild of the matches so that we only do it once the
    // user stops typing
    const updateSuggestions = debounce(() => {
      setSuggestions(getSuggestions());
    }, 500);

    updateSuggestions();
  }, [opts.value, opts.schools]);

  return suggestions;
}
