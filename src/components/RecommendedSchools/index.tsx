"use client";

import { useMemo } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useSchools } from "@/hooks/useSchools";
import SchoolCard from "@/components/SchoolCard";
import ScrollArea from "@/components/ScrollArea";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

/**
 * 
 * @param props.title
 *   The name of the group of schools
 * @param props.schoolIds
 *   An array of school IDs included in this group
 */
export default function RecommendedSchools(props: {
  title: string;
  schoolIds: string[];
}) {
  const {
    title,
    schoolIds,
  } = props;

  const {
    data: schools = [],
  } = useSchools();

  const isMounted = useIsMounted();

  // We randomly select five of the provided schools to show
  const ids = useMemo(() => {
    if (!isMounted) return [];
    return schoolIds.slice(0, 5);
  }, [isMounted, schoolIds]);

  const recommendedSchools = useMemo(() => {
    return schools.filter((school) => (
      ids.includes(school.id)
    ));
  }, [ids, schools]);
  
  return (
    <Well>
      <div className={styles.recommendedSection}>
        <h2 className={styles.title}>{title}</h2>

        <ScrollArea scroll="x">
          <div className={styles.schools}>
            {recommendedSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Well>
  );
}
