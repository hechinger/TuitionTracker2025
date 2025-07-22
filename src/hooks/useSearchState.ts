import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";

export const schoolTypes = ["public", "private", "for-profit"] as const;
export const degreeTypes = ["any", "4-year", "2-year"] as const;

export type SchoolType = typeof schoolTypes[number];
export type DegreeType = typeof degreeTypes[number];

const SearchSchema = z.object({
  where: z.string().default(""),
  states: z.array(z.string()).default([]),
  minPrice: z.number().default(0),
  maxPrice: z.number().optional(),
  schoolType: z.array(z.enum(schoolTypes)).default([]),
  degreeType: z.enum(degreeTypes).default("any"),
  tribalCollege: z.boolean().default(false),
  hbcu: z.boolean().default(false),
});

export type SearchOptions = z.infer<typeof SearchSchema>;

export type UpdateSearch = (key: string, value: unknown) => void;

export function useSearchState({
  autoload = false,
  param = "search",
}) {
  const router = useRouter();

  const [cacheClear, setCacheClear] = useState({});
  const [search, setSearch] = useState(SearchSchema.parse({}));

  useEffect(() => {
    if (!autoload) return;

    const q = new URLSearchParams(window.location.search);
    const searchString = q.get(param) || "{}";

    try {
      const parsed = JSON.parse(searchString);
      setSearch(SearchSchema.parse(parsed));
    } catch(error) {
      console.error("Error loading search state from URL query parameters");
      console.error(error);
    }
  }, [param, autoload, cacheClear]);

  const searchQueryString = useMemo(() => {
    const query = new URLSearchParams();
    query.set(param, JSON.stringify(search));
    return query.toString();
  }, [param, search]);

  const updateSearch = useCallback((key: string, value: unknown) => {
    const parsed = SearchSchema.partial().parse({
      [key]: value,
    });
    setSearch((old) => ({ ...old, ...parsed }));
  }, []);

  const toggleState = useCallback((state: string) => {
    setSearch((old) => {
      const hasState = old.states.includes(state);
      const rest = old.states.filter((s) => s !== state);
      const newStates = hasState ? rest : [...rest, state];
      return {
        ...old,
        where: "",
        states: newStates,
      };
    });
  }, []);

  const resetAdvanced = useCallback(() => {
    setSearch((old) => SearchSchema.parse({
      where: old.where,
    }));
  }, []);

  const runSearch = useCallback(() => {
    setCacheClear({ ...cacheClear });
    router.push(`/search?${searchQueryString}`);
  }, [cacheClear, searchQueryString, router]);

  return {
    search,
    toggleState,
    resetAdvanced,
    updateSearch,
    searchQueryString,
    runSearch,
  };
}
