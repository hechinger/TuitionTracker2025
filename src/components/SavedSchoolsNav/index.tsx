"use client";

import Link from "next/link";
import { useSavedSchools } from "@/hooks/useSavedSchools";
import { getCompareRoute } from "@/utils/routes";
import styles from "./styles.module.scss";

export default function SavedSchoolsNav() {
  const savedSchools = useSavedSchools();
  const numSaved = savedSchools.schools.length;

  if (numSaved < 1) {
    return null;
  }

  return (
    <div className={styles.nav}>
      <Link href={getCompareRoute()} className={styles.link}>
        {numSaved > 0 && (
          <span className={styles.num}>
            {numSaved.toLocaleString()}
          </span>
        )}
        <span>
          Compare your schools
        </span>
      </Link>
    </div>
  );
}
