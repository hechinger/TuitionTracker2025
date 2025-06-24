"use client";

import { type SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

export default function GenderBars(props: {
  school: SchoolDetail;
}) {
  const { byGender, total } = props.school.enrollment;
  const male = byGender.men / total;

  return (
    <div>
      <div
        className={styles.barContainer}
      >
        <div
          className={styles.barHighlight}
          style={{ width: `${male * 100}%` }}
        />
      </div>
    </div>
  );
}
