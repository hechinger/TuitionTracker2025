"use client";

import clsx from "clsx";
import { type SchoolDetail } from "@/types";
import { formatPercent } from "@/utils/formatPercent";
import styles from "./styles.module.scss";

const demoLabels = {
  unknown: "Unknown",
  multiple: "Two or more races",
  white: "White",
  hisp: "Hispanic",
  nathawpacisl: "Native Hawaiian/Pacific Islander",
  black: "Black",
  asian: "Asian",
  amerindalasknat: "American Indian/Alaska Native",
  nonresident: "Nonresident",
} as Record<string, string>;

export default function DemoBars(props: {
  school: SchoolDetail;
}) {
  const demos = props.school.enrollment.byRace;

  const values = Object.entries(demos)
    .map(([demo, value]) => ({
      demo,
      value: value / props.school.enrollment.total,
    }))
    .sort((a, b) => b.value - a.value);


  const getStyles = (value: number) => ({
    '--percent': `${value * 100}%`,
  }) as React.CSSProperties;

  return (
    <div className={styles.bars}>
      {values.map((d) => (
        <div key={d.demo}>
          <h3>{demoLabels[d.demo]}</h3>
          <div
            className={styles.barContainer}
            style={getStyles(d.value)}
          >
            <div className={styles.barHighlight} />
            <div className={clsx(styles.label, { [styles.left]: d.value > 0.8 })}>
              {formatPercent(d.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
