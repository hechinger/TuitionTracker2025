"use client";

import { useSchool } from "@/hooks/useSchool";
import OverallBar from "./OverallBar";
import RadarChart from "./RadarChart";

export default function GraduationRateSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);

  return (
    <div>
      <h2>Graduation Rate</h2>
      {school && (
        <>
          <OverallBar school={school} />
          <RadarChart school={school} />
        </>
      )}
    </div>
  );
}