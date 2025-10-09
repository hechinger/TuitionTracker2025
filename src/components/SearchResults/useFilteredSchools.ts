import { useMemo } from "react";
import type { IncomeBracketKey, SchoolIndex } from "@/types";
import type { SearchOptions } from "@/hooks/useSearchState";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";

const matchName = (opts: {
  school: SchoolIndex;
  name: SearchOptions["where"];
}) => {
  if (!opts.name) return true;
  const aliases = [
    opts.school.name.toLowerCase(),
    ...opts.school.alias.toLowerCase().split('|').map((n) => n.trim()).filter(Boolean),
  ];
  const lowerName = opts.name.toLowerCase();
  return aliases.some((alias) => alias.includes(lowerName));
};

const matchStates = (opts: {
  school: SchoolIndex;
  states: SearchOptions["states"];
}) => {
  if (!opts.states || opts.states.length < 1) return true;
  return opts.states.includes(opts.school.state);
};

const matchCost = (opts: {
  school: SchoolIndex;
  bracket?: IncomeBracketKey;
  minPrice: SearchOptions["minPrice"];
  maxPrice: SearchOptions["maxPrice"];
}) => {
  const { bracket = "average" } = opts;
  const cost = opts.school.netPricesByBracket[bracket];
  if (cost < opts.minPrice) return false;
  if (opts.maxPrice && opts.maxPrice < cost) return false;
  return true;
};

const matchSchoolType = (opts: {
  school: SchoolIndex;
  schoolType: SearchOptions["schoolType"];
}) => {
  if (!opts.schoolType || opts.schoolType.length < 1) return true;
  return opts.schoolType.includes(opts.school.schoolControl);
};

const matchDegreeType = (opts: {
  school: SchoolIndex;
  degreeType: SearchOptions["degreeType"];
}) => {
  if (!opts.degreeType || opts.degreeType === "any") return true;
  return opts.degreeType === opts.school.degreeLevel;
};

const matchTribalCollege = (opts: {
  school: SchoolIndex;
  tribalCollege: boolean;
}) => {
  if (!opts.tribalCollege) return true;
  return opts.school.tribalCollege;
};

const matchHbcu = (opts: {
  school: SchoolIndex;
  hbcu: boolean;
}) => {
  if (!opts.hbcu) return true;
  return opts.school.hbcu;
};

export function useFilteredSchools(opts: {
  schools: SchoolIndex[];
  search: SearchOptions;
  sorting: string;
}) {
  const {
    schools = [],
    search,
    sorting,
  } = opts;

  const { bracket = "average" } = useIncomeBracket();

  return useMemo(() => {
    const schoolSet = schools.filter((school) => (
      matchName({ school, name: search.where })
      && matchStates({ school, states: search.states })
      && matchCost({ school, bracket, minPrice: search.minPrice, maxPrice: search.maxPrice })
      && matchSchoolType({ school, schoolType: search.schoolType })
      && matchDegreeType({ school, degreeType: search.degreeType })
      && matchTribalCollege({ school, tribalCollege: search.tribalCollege })
      && matchHbcu({ school, hbcu: search.hbcu })
    ));

    return schoolSet.sort((a, b) => {
      const priceA = a.stickerPrice.price; // a.netPricesByBracket[bracket];
      const priceB = b.stickerPrice.price; // b.netPricesByBracket[bracket];

      const alpha = a.name.localeCompare(b.name);

      if (sorting === "priceLowHigh") {
        // Check if either school has "No Data" for price sorts
        const aHasPrice = priceA != null && priceA > 0;
        const bHasPrice = priceB != null && priceB > 0;
        
        if (!aHasPrice && bHasPrice) return 1;  // a goes after b
        if (aHasPrice && !bHasPrice) return -1; // a goes before b
        if (!aHasPrice && !bHasPrice) return alpha; // both no data, sort by name
        return (priceA - priceB) || alpha;
      }

      if (sorting === "priceHighLow") {
        return (priceB - priceA) || alpha;
      }

      return a.name.localeCompare(b.name);
    });
  }, [schools, search, bracket, sorting]);
}
