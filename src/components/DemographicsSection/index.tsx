"use client";

import { useSchool } from "@/hooks/useSchool";
import SizeHistogram from "@/components/SizeHistogram";
import GenderBars from "./GenderBars";
import DemoBars from "./DemoBars";

export default function DemographicsSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);

  return (
    <div>
      <h2>Student Demographics</h2>
      {school && (
        <>
          <SizeHistogram
            size={school.enrollment.total}
          />
          <GenderBars school={school} />
          <DemoBars school={school} />
        </>
      )}
    </div>
  );
}
