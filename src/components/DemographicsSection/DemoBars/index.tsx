"use client";

import clsx from "clsx";
import { type SchoolDetail } from "@/types";
import { formatPercent } from "@/utils/formatPercent";
import { isNotUndefined } from "@/utils/isNotUndefined";
import { useContent } from "@/hooks/useContent";
import styles from "./styles.module.scss";

export default function DemoBars(props: {
  school: SchoolDetail;
}) {
  const content = useContent();
  const demos = props.school.enrollment.byRace;

  const values = Object.entries(demos)
    .map(([demo, value]) => {
      if (!value) return undefined;
      return {
        demo,
        value: value / props.school.enrollment.total,
      };
    })
    .filter(isNotUndefined)
    .sort((a, b) => b.value - a.value);


  const getStyles = (value: number) => ({
    '--percent': `${value * 100}%`,
  }) as React.CSSProperties;

  return (
    <div className={styles.bars}>
      {values.map((d) => (
        <div key={d.demo}>
          <h3>
            {content(`GeneralPurpose.demographicCategories.${d.demo}`)}
          </h3>
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
