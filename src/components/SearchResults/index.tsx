"use client";

import { useState } from "react";
import chunk from "lodash/chunk";
import { useParseSearchQuery } from "@/hooks/useParseSearchQuery";
import { useSchools } from "@/hooks/useSchools";
import SchoolCard from "@/components/SchoolCard";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

const matchName = (opts: {
  school: SchoolIndex;
  name: string;
}) => {
  if (!opts.name) return true;
  const aliases = [
    opts.school.name.toLowerCase(),
    ...opts.school.alias.toLowerCase().split('|').map((n) => n.trim()).filter(Boolean),
  ];
  const lowerName = opts.name.toLowerCase();
  return aliases.some((alias) => alias.includes(lowerName));
};

const matchSchoolType = (opts: {
  school: SchoolIndex;
  schoolType: {
    public: boolean;
    private: boolean;
    forprofit: boolean;
  },
}) => {
  return opts.schoolType[opts.school.schoolControl];
};

export default function SearchResults() {
  const [page, setPage] = useState(0);

  const query = useParseSearchQuery();
  const {
    isPending,
    data: schools = [],
  } = useSchools();

  if (isPending) {
    return null;
  }

  const filteredSchools = schools.filter((school) => {
    if (!matchName({ school, name: query.where })) return false;
    if (!matchSchoolType({ school, schoolType: query.schoolType })) return false;
    return true;
  });

  const pages = chunk(filteredSchools, 20);
  const activeSchools = pages[page] || [];

  console.log({ schools, filteredSchools, pages, activeSchools, query });

  return (
    <div className={styles.container}>
      <div>
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
    </div>
  );
}
