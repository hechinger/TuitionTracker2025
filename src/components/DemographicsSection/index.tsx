"use client";

import { useSchool } from "@/hooks/useSchool";
import { useSizePercentile } from "@/hooks/useSizePercentile";
import { formatOrdinal } from "@/utils/formatOrdinal";
import { formatPercent } from "@/utils/formatPercent";
import Well from "@/components/Well";
import Robotext from "@/components/Robotext";
import SizeHistogram from "@/components/SizeHistogram";
import GenderBars from "./GenderBars";
import DemoBars from "./DemoBars";
import styles from "./styles.module.scss";

const sizeTemplate = `
  <p>
    The size and makeup of a school’s student body can have a large impact on a student’s experience. <strong>{schoolName}</strong> has {enrollment} students, which puts it in the <strong>{sizePercentile} percentile</strong> of {schoolType} schools.
  </p>
`;

const genderTemplate = `
  <p>
    Different schools attract students from different backgrounds. At <strong>{schoolName}</strong>, about <strong>{genderPercentMajority}</strong> of students are {genderNameMajority}.
  </p>
`;

const demoTemplate = `
  <p>
    The demographic makeup of a school’s student body also plays a big role in its campus culture. At <strong>{schoolName}</strong>, about <strong>{demographicPercentMajority}</strong> of students are {demographicNameMajority}.
  </p>
`;

export default function DemographicsSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);
  const sizePercentile = useSizePercentile(school?.enrollment.total || 0);

  if (!school) return null;

  const sizeContext = {
    schoolName: school.name,
    enrollment: school.enrollment.total.toLocaleString(),
    sizePercentile: formatOrdinal(Math.round(sizePercentile * 100)),
    schoolType: `${school.schoolControl}, ${school.degreeLevel}`,
  };

  const majorityGender = Object.entries(school.enrollment.byGender)
    .reduce((max, entry) => {
      if (!max) return entry;
      if (entry[1] > max[1]) return entry;
      return max;
    }, undefined);
  const genderLabels = {
    men: "male",
    women: "female",
    unknown: "of unknown gender",
    other: "of a gender other than male or female",
  };
  const genderContext = {
    schoolName: school.name,
    genderNameMajority: genderLabels[majorityGender[0]],
    genderPercentMajority: formatPercent(majorityGender[1] / school.enrollment.total),
  };

  const majorityDemo = Object.entries(school.enrollment.byRace)
    .reduce((max, entry) => {
      if (!max) return entry;
      if (entry[1] > max[1]) return entry;
      return max;
    }, undefined);
  const demoLabels = {
    unknown: "of an unknown demographic background",
    multiple: "of multiple races",
    white: "white",
    hisp: "hispanic",
    nathawpacisl: "Native Hawaiian or Pacific Islanders",
    black: "black",
    asian: "Asian",
    amerindalasknat: "American Indians or Alaskan Natives",
    nonresident: "not U.S. residents",
  };
  const demoContext = {
    schoolName: school.name,
    demographicNameMajority: demoLabels[majorityDemo[0]],
    demographicPercentMajority: formatPercent(majorityDemo[1] / school.enrollment.total),
  };

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        Student Demographics
      </h2>

      {school && (
        <>
          <Robotext
            template={sizeTemplate}
            context={sizeContext}
          />

          <div className={styles.chart}>
            <SizeHistogram
              size={school.enrollment.total}
              schoolControl={school.schoolControl}
              degreeLevel={school.degreeLevel}
            />
          </div>

          <Robotext
            template={genderTemplate}
            context={genderContext}
          />

          <div className={styles.chart}>
            <GenderBars school={school} />
          </div>

          <Robotext
            template={demoTemplate}
            context={demoContext}
          />

          <div className={styles.chart}>
            <DemoBars school={school} />
          </div>
        </>
      )}
    </Well>
  );
}
