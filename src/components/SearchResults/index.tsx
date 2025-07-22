"use client";

import chunk from "lodash/chunk";
import { useSearchState } from "@/hooks/useSearchState";
import { useSchools } from "@/hooks/useSchools";
import Well from "@/components/Well";
import SchoolCard from "@/components/SchoolCard";
import Pagination from "./Pagination";
import { useFilteredSchools } from "./useFilteredSchools";
import { useSearchUi } from "./useSearchUi";
import styles from "./styles.module.scss";

/**
 * The paginated grid of search results on the search results page.
 */
export default function SearchResults() {
  const {
    resultsRef,
    page,
    updatePage,
    sorting,
    setSorting,
  } = useSearchUi();

  const { search } = useSearchState({
    autoload: true,
  });

  const {
    isPending,
    data: schools = [],
  } = useSchools();

  const filteredSchools = useFilteredSchools({
    schools,
    search,
    sorting,
  });

  if (isPending) {
    return null;
  }

  const pages = chunk(filteredSchools, 20);
  const activeSchools = pages[page] || [];

  return (
    <div
      ref={resultsRef}
      className={styles.container}
    >
      <Well>
        <div className={styles.resultsTop}>
          <div className={styles.stats}>
            Found
            {' '}
            {filteredSchools.length.toLocaleString()}
            {' '}
            {filteredSchools.length === 1 ? 'school' : 'schools'}
          </div>

          <div className={styles.sorting}>
            <span>Sort by</span>

            <select
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
            >
              <option value="alpha">Name</option>
              <option value="priceLowHigh">Price $ - $$$</option>
              <option value="priceHighLow">Price $$$ - $</option>
            </select>
          </div>
        </div>

        <div className={styles.schools}>
          {activeSchools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
            />
          ))}
        </div>

        <Pagination
          page={page}
          setPage={updatePage}
          totalPages={pages.length}
        />
      </Well>
    </div>
  );
}
