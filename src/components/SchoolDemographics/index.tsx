"use client";

import { useSizePercentile } from "@/hooks/useSizePercentile";
import { useContent } from "@/hooks/useContent";
import { formatOrdinal } from "@/utils/formatOrdinal";
import { formatPercent } from "@/utils/formatPercent";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import SizeHistogram from "@/components/SizeHistogram";
import type { SchoolDetail } from "@/types";
import GenderBars from "./GenderBars";
import DemoBars from "./DemoBars";
import styles from "./styles.module.scss";

/**
 * Renders the demographics section of the school detail page.
 */
export default function SchoolDemographics(props: {
  school: SchoolDetail;
}) {
  const {
    school,
  } = props;

  const content = useContent();
  const sizePercentile = useSizePercentile(school?.enrollment.total || 0);

  if (!school) return null;

  const sizeContext = {
    SCHOOL_NAME: school.name,
    ENROLLMENT: school.enrollment?.total.toLocaleString(),
    SIZE_PERCENTILE: formatOrdinal(Math.round(sizePercentile * 100)),
    SCHOOL_TYPE: `${school.schoolControl}, ${school.degreeLevel}`, // FIXME
  };

  const majorityGender = Object.entries(school.enrollment.byGender)
    .reduce((max: [string, number] | undefined, entry: [string, number]) => {
      if (!max) return entry;
      if (entry[1] > max[1]) return entry;
      return max;
    }, undefined)!;
  const genderLabels = {
    men: content("SchoolPage.StudentDemographics.gender.genderTextNames.men"),
    women: content("SchoolPage.StudentDemographics.gender.genderTextNames.women"),
    unknown: content("SchoolPage.StudentDemographics.gender.genderTextNames.unknown"),
    other: content("SchoolPage.StudentDemographics.gender.genderTextNames.other"),
  } as Record<string, string>;
  const genderContext = {
    SCHOOL_NAME: school.name,
    GENDER_NAME_MAX: genderLabels[majorityGender[0]],
    GENDER_PERCENT_MAX: formatPercent(majorityGender[1] / school.enrollment.total),
  };

  const majorityDemo = Object.entries(school.enrollment.byRace)
    .reduce((max: [string, number] | undefined, entry: [string, number]) => {
      if (!max) return entry;
      if (entry[1] > max[1]) return entry;
      return max;
    }, undefined)!;
  const demoLabels = {
    unknown: content("SchoolPage.StudentDemographics.race.demographicTextNames.unknown"),
    multiple: content("SchoolPage.StudentDemographics.race.demographicTextNames.multiple"),
    white: content("SchoolPage.StudentDemographics.race.demographicTextNames.white"),
    hisp: content("SchoolPage.StudentDemographics.race.demographicTextNames.hisp"),
    nathawpacisl: content("SchoolPage.StudentDemographics.race.demographicTextNames.nathawpacisl"),
    black: content("SchoolPage.StudentDemographics.race.demographicTextNames.black"),
    asian: content("SchoolPage.StudentDemographics.race.demographicTextNames.asian"),
    amerindalasknat: content("SchoolPage.StudentDemographics.race.demographicTextNames.amerindalasknat"),
    nonresident: content("SchoolPage.StudentDemographics.race.demographicTextNames.nonresident"),
  } as Record<string, string>;
  const demoContext = {
    SCHOOL_NAME: school.name,
    DEMOGRAPHIC_NAME_MAX: demoLabels[majorityDemo[0]],
    DEMOGRAPHIC_PERCENT_MAX: formatPercent(majorityDemo[1] / school.enrollment.total),
  };

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        {content("SchoolPage.StudentDemographics.title")}
      </h2>

      {school && (
        <>
          <Robotext
            template={content("SchoolPage.StudentDemographics.size.template")}
            context={sizeContext}
            variant="graf"
          />

          <div className={styles.chart}>
            <SizeHistogram
              size={school.enrollment.total}
              schoolControl={school.schoolControl}
              degreeLevel={school.degreeLevel}
            />
          </div>

          <Robotext
            template={content("SchoolPage.StudentDemographics.gender.template")}
            context={genderContext}
            variant="graf"
          />

          <div className={styles.chart}>
            <GenderBars school={school} />
          </div>

          <Robotext
            template={content("SchoolPage.StudentDemographics.race.template")}
            context={demoContext}
            variant="graf"
          />

          <div className={styles.chart}>
            <DemoBars school={school} />
          </div>
        </>
      )}
    </Well>
  );
}
