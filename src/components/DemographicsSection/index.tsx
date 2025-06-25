"use client";

import { useSchool } from "@/hooks/useSchool";
import Well from "@/components/Well";
import SizeHistogram from "@/components/SizeHistogram";
import GenderBars from "./GenderBars";
import DemoBars from "./DemoBars";
import styles from "./styles.module.scss";

export default function DemographicsSection(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);

  return (
    <Well width="text" section>
      <h2 className={styles.sectionTitle}>
        Student Demographics
      </h2>

      {school && (
        <>
          <p className={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus
            mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
            urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
            egestas.
          </p>

          <div className={styles.chart}>
            <SizeHistogram
              size={school.enrollment.total}
            />
          </div>

          <p className={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus
            mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
            urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
            egestas.
          </p>

          <div className={styles.chart}>
            <GenderBars school={school} />
          </div>

          <p className={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus
            mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
            urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
            egestas.
          </p>

          <div className={styles.chart}>
            <DemoBars school={school} />
          </div>
        </>
      )}
    </Well>
  );
}
