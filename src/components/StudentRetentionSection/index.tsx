"use client";

import { useSchool } from "@/hooks/useSchool";
import DonutChart from "@/components/DonutChart";

export default function StudentRetentionSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);

  return (
    <div>
      <h2>Student Retention</h2>
      {school && (
        <div>
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
    </div>
  );
}
