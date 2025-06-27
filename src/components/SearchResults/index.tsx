"use client";

import { useState, useCallback, useRef } from "react";
import chunk from "lodash/chunk";
import { useSearchState } from "@/hooks/useSearchState";
import { useSchools } from "@/hooks/useSchools";
import Well from "@/components/Well";
import SchoolCard from "@/components/SchoolCard";
import { useFilteredSchools } from "./useFilteredSchools";
import Pagination from "./Pagination";
import styles from "./styles.module.scss";

export default function SearchResults() {
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const updatePage = useCallback((value: number) => {
    setPage(value);
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const [sorting, setSorting] = useState("alpha");

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
      ref={ref}
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
