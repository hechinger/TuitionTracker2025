"use client";

import { useSchool } from "@/hooks/useSchool";
import { useContent } from "@/hooks/useContent";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import { formatPercent } from "@/utils/formatPercent";
import { getGraduation } from "@/utils/formatSchoolInfo";
import OverallBar from "./OverallBar";
import RadarChart from "./RadarChart";
import styles from "./styles.module.scss";

export default function GraduationRateSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);
  const content = useContent();

  if (!school) return null;

  const overallTemplate = content("SchoolPage.GraduationRates.overallTemplate.template");
  const demoTemplate = content("SchoolPage.GraduationRates.demographicTemplate");

  const grad = getGraduation(school);
  const overallContext = {
    SCHOOL_NAME: school.name,
    GRADUATION_RATE: formatPercent(grad.total),
    DEGREE_TYPE: content(`SchoolPage.GraduationRates.overallTemplate.degreeTypes.${school.degreeLevel}`),
    DEGREE_YEARS: content(`SchoolPage.GraduationRates.overallTemplate.degreeYearsCompletionLimit.${school.degreeLevel}`),
  };

  const demoContext = {
    SCHOOL_NAME: school.name,
  };

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        {content("SchoolPage.GraduationRates.title")}
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
