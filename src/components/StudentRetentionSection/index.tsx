"use client";

import { useSchool } from "@/hooks/useSchool";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import DonutChart from "@/components/DonutChart";
import styles from "./styles.module.scss";

const retentionTemplate = `
  <p>
    Student retention, or how frequently enrolled students return to continue their degree after the first year or two, is another helpful indicator of how successful students at a school tend to be. At <strong>{schoolName}</strong>, about <span class="highlight">{fullTimeRetentionRate}</span> of full-time students return to continue their degree.
  </p>
`;

export default function StudentRetentionSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);

  if (!school) return null;

  const retentionContext = {
    schoolName: school.name,
    fullTimeRetentionRate: school.retention.fullTime.toLocaleString(undefined, {
      style: "percent",
      maximumFractionDigits: 0,
    }),
  };

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        Student Retention
      </h2>

      <Robotext
        context={retentionContext}
        template={retentionTemplate}
        highlightColor="blue"
      />

      {school && (
        <div className={styles.charts}>
          <DonutChart
            value={school.retention.fullTime}
            label="retention"
            title="Full-time students"
          />

          <DonutChart
            value={school.retention.partTime}
            label="retention"
            title="Part-time students"
          />
        </div>
      )}
    </Well>
  );
}
