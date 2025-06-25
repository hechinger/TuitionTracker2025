"use client";

import { useSchool } from "@/hooks/useSchool";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import OverallBar from "./OverallBar";
import RadarChart from "./RadarChart";
import styles from "./styles.module.scss";

const overallTemplate = `
  <p>
    A school’s graduation rate can help capture how likely a student is to complete their degree. At <strong>{schoolName}</strong>, roughly <span class="highlight">{graduationRate}</span> of students achieve their {degreeType} within {degreeYears} of enrolling.
  </p>
`;

const demoTemplate = `
  <p>
    Students of different demographic backgrounds often graduate at different rates, so it can be helpful to look beyond the overall graduation rate. This chart shows how students of different demographic backgrounds fare completing their degrees at <strong>{schoolName}</strong>.
  </p>
`;

export default function GraduationRateSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);

  if (!school) return null;

  const overallContext = {
    schoolName: school.name,
    graduationRate: school.graduationBachelors.total.toLocaleString(undefined, {
      style: "percent",
      maximumFractionDigits: 0,
    }),
    degreeType: "bachelor’s degree",
    degreeYears: "six years",
  };

  const demoContext = {
    schoolName: school.name,
  };

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        Graduation Rate
      </h2>

      {school && (
        <>
          <Robotext
            context={overallContext}
            template={overallTemplate}
            highlightColor="blue"
          />

          <OverallBar school={school} />

          <Robotext
            context={demoContext}
            template={demoTemplate}
            highlightColor="blue"
          />

          <RadarChart school={school} />
        </>
      )}
    </Well>
  );
}
