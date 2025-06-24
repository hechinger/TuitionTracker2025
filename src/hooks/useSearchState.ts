import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

export const schoolTypes = ["public", "private", "for-profit"] as const;
export const degreeTypes = ["any", "4-year", "2-year"] as const;

export type SchoolType = typeof schoolTypes[number];
export type DegreeType = typeof degreeTypes[number];

const SearchSchema = z.object({
  where: z.string().default(""),
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
  const [search, setSearch] = useState(SearchSchema.parse({}));
  const q = useSearchParams();

  const searchString = q.get(param) || "{}";

  useEffect(() => {
    if (!autoload) return;

    try {
      const parsed = JSON.parse(searchString);
      setSearch(SearchSchema.parse(parsed));
    } catch(error) {
      console.error("Error loading search state from URL query parameters");
      console.error(error);
    }
  }, [searchString, autoload]);

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

  return {
    search,
    updateSearch,
    searchQueryString,
  };
}
