"use client";

import { useState } from "react";
import chunk from "lodash/chunk";
import { useSearchState } from "@/hooks/useSearchState";
import { useSchools } from "@/hooks/useSchools";
import Well from "@/components/Well";
import SchoolCard from "@/components/SchoolCard";
import { useFilteredSchools } from "./useFilteredSchools";
import styles from "./styles.module.scss";

export default function SearchResults() {
  const [page, setPage] = useState(0);

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
  });

  if (isPending) {
    return null;
  }

  const pages = chunk(filteredSchools, 20);
  const activeSchools = pages[page] || [];

  return (
    <div className={styles.container}>
      <Well>
        <div className={styles.stats}>
          Found
          {' '}
          {filteredSchools.length.toLocaleString()}
          {' '}
          {filteredSchools.length === 1 ? 'school' : 'schools'}
        </div>

        <div className={styles.schools}>
          {activeSchools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
            />
          ))}
        </div>
      </Well>
    </div>
  );
}
