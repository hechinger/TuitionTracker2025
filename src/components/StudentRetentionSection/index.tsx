"use client";

import { useSchool } from "@/hooks/useSchool";
import { useContent } from "@/hooks/useContent";
import { formatPercent } from "@/utils/formatPercent";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import DonutChart from "@/components/DonutChart";
import styles from "./styles.module.scss";

const nationalAverages = {
  fullTime: 0.7185,
  partTime: 0.4584,
};

export default function StudentRetentionSection(props: {
  schoolId: string;
}) {
  const content = useContent();
  const { data: school } = useSchool(props.schoolId);

  if (!school) return null;

  const retentionContext = {
    SCHOOL_NAME: school.name,
    FULL_TIME_RETENTION_RATE: formatPercent(school.retention.fullTime),
  };

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        {content("SchoolPage.StudentRetention.title")}
      </h2>

      <Robotext
        context={retentionContext}
        template={content("SchoolPage.StudentRetention.template")}
        highlightColor="blue"
        variant="graf"
      />

      {school && (
        <div className={styles.charts}>
          {school.retention.fullTime && (
            <DonutChart
              value={school.retention.fullTime}
              label="retention"
              title={content("SchoolPage.StudentRetention.fullTimeStudents")}
              benchmark={nationalAverages.fullTime}
              benchmarkLabel="Nat’l average"
            />
          )}

          {school.retention.partTime && (
            <DonutChart
              value={school.retention.partTime}
              label="retention"
              title={content("SchoolPage.StudentRetention.partTimeStudents")}
              benchmark={nationalAverages.partTime}
              benchmarkLabel="Nat’l average"
            />
          )}
        </div>
      )}
    </Well>
  );
}
