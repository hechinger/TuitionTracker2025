"use client";

import { useSchools } from "@/hooks/useSchools";
import SchoolCard from "@/components/SchoolCard";
import ScrollArea from "@/components/ScrollArea";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

export default function RecommendedSchools(props: {
  title: string;
  schoolIds: string[];
}) {
  const {
    data: schools = [],
  } = useSchools();

  const recommendedSchools = schools.filter((school) => (
    props.schoolIds.includes(school.id)
  ));

  return (
    <Well>
      <div className={styles.recommendedSection}>
        <h2 className={styles.title}>{props.title}</h2>

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
