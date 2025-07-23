"use client";

import { useContent } from "@/hooks/useContent";
import { formatPercent } from "@/utils/formatPercent";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import DonutChart from "@/components/DonutChart";
import type { SchoolDetail, NationalAverages } from "@/types";
import styles from "./styles.module.scss";

/**
 * Renders the student retention section of the school detail page.
 */
export default function StudentRetentionSection(props: {
  school: SchoolDetail;
  nationalAverages: NationalAverages;
}) {
  const {
    school,
  } = props;

  const content = useContent();

  if (!school) return null;

  const nationalAverages = props.nationalAverages[school.degreeLevel];

  const retentionContext = {
    SCHOOL_NAME: school.name,
    FULL_TIME_RETENTION_RATE: formatPercent(school.retention.fullTime),
  };

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        {content("SchoolPage.StudentRetention.title")}
      </h2>

      <div className={styles.content}>
        <Robotext
          context={retentionContext}
          template={content("SchoolPage.StudentRetention.template")}
          highlightColor="blue"
          variant="graf"
        />
      </div>

      <div className={styles.charts}>
        {school.retention.fullTime && (
          <DonutChart
            value={school.retention.fullTime}
            label="retention"
            title={content("SchoolPage.StudentRetention.fullTimeStudents")}
            benchmark={nationalAverages.retentionFullTime}
            benchmarkLabel="Nat’l average"
          />
        )}

        {school.retention.partTime && (
          <DonutChart
            value={school.retention.partTime}
            label="retention"
            title={content("SchoolPage.StudentRetention.partTimeStudents")}
            benchmark={nationalAverages.retentionPartTime}
            benchmarkLabel="Nat’l average"
          />
        )}
      </div>
    </Well>
  );
}
