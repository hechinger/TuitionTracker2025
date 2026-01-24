"use client";

import { useMemo } from "react";
import { shuffle } from "d3-array";
import { useIsMounted } from "@/hooks/useIsMounted";
import SchoolCard from "@/components/SchoolCard";
import ScrollArea from "@/components/ScrollArea";
import Well from "@/components/Well";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

/**
 * 
 * @param props.title
 *   The name of the group of schools
 * @param props.schools
 *   An array of schools included in this group
 */
export default function RecommendedSchools(props: {
  title: string;
  schools: SchoolIndex[];
}) {
  const {
    title,
    schools,
  } = props;

  const isMounted = useIsMounted();

  // We randomly select five of the provided schools to show
  const recommendedSchools = useMemo(() => {
    if (!isMounted) return undefined;
    return shuffle([...schools]).slice(0, 5);
  }, [isMounted, schools]);

  return (
    <Well>
      <div className={styles.recommendedSection}>
        <h2 className={styles.title}>{title}</h2>

        <ScrollArea scroll="x">
          <div className={styles.schools}>
            {recommendedSchools && recommendedSchools.map((school, index) => (
              <SchoolCard
                key={school.id}
                school={school}
                priority={index === 0}
              />
            ))}

            {!recommendedSchools && [...Array(5)].map((_, i) => (
              <div
                key={i}
                className={styles.placeholder}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Well>
  );
}
