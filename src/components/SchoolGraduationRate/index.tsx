"use client";

import { useContent } from "@/hooks/useContent";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import { formatPercent } from "@/utils/formatPercent";
import { getGraduation } from "@/utils/formatSchoolInfo";
import type { SchoolDetail, NationalAverages } from "@/types";
import OverallBar from "./OverallBar";
import RadarChart from "./RadarChart";
import styles from "./styles.module.scss";

/**
 * The graduation rate section of the school detail page.
 */
export default function SchoolGraduationRate(props: {
  school: SchoolDetail;
  nationalAverages: NationalAverages;
}) {
  const {
    school,
    nationalAverages,
  } = props;

  const content = useContent();

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
        <div className={styles.content}>
          <Robotext
            context={overallContext}
            template={overallTemplate}
            highlightColor="blue"
            variant="graf"
          />

          <OverallBar
            school={school}
            nationalAverages={nationalAverages}
          />

          <Robotext
            context={demoContext}
            template={demoTemplate}
            highlightColor="blue"
            variant="graf"
          />

          <RadarChart
            school={school}
            nationalAverages={nationalAverages}
          />
        </div>
      )}
    </Well>
  );
}
