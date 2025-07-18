"use client";

import { useRef } from "react";
import clsx from "clsx";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import { useContent } from "@/hooks/useContent";
import { formatPercent } from "@/utils/formatPercent";
import { type SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

export default function GenderBars(props: {
  school: SchoolDetail;
}) {
  const content = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const { byGender, total } = props.school.enrollment;
  const male = byGender.men / total;
  const female = byGender.women / total;
  const other = (byGender.other + byGender.unknown) / total;

  const height = other > 0 ? 80 : 60;
  const margin = {
    top: 24,
    right: 0,
    bottom: other > 0 ? 20 : 0,
    left: 0,
  };

  const x = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  const data = [
    {
      key: "female",
      value: female,
    },
    {
      key: "other",
      value: other,
    },
    {
      key: "male",
      value: male,
    },
  ];

  const rects = data.reduce((ds, d) => {
    const prev = ds[ds.length - 1];
    const prevStart = prev?.start ?? x(0);
    const prevWidth = prev?.width ?? 0;
    const start = prevStart + prevWidth;
    const width = x(d.value) - x(0);
    const point = {
      key: d.key,
      start,
      width,
    };
    ds.push(point);
    return ds;
  }, [] as { key: string, start: number, width: number }[]);

  return (
    <div
      ref={ref}
      className={styles.plot}
    >
      <svg
        width={width}
        height={height}
        className={styles.svg}
      >
        <rect
          x={x(0)}
          y={margin.top}
          width={x(1) - x(0)}
          height={height - margin.top - margin.bottom}
          className={styles.bgBar}
        />
        {rects.map((rect) => (
          <rect
            key={rect.key}
            x={rect.start}
            y={margin.top}
            width={rect.width}
            height={height - margin.top - margin.bottom}
            className={clsx(styles.dataBar, styles[rect.key])}
          />
        ))}
      </svg>

      <div className={styles.annotation}>
        <div
          className={styles.label}
          style={{ transform: `translateX(${x(0)}px)` }}
        >
          {formatPercent(female)}
          {" "}
          {content("SchoolPage.StudentDemographics.gender.genderChartLabels.women")}
        </div>

        <div
          className={styles.label}
          style={{ transform: `translateX(${x(1)}px) translateX(-100%)` }}
        >
          {formatPercent(male)}
          {" "}
          {content("SchoolPage.StudentDemographics.gender.genderChartLabels.men")}
        </div>

        {other > 0 && (
          <div
            className={styles.otherLabel}
            style={{ transform: `translateX(${x(female + (other / 2))}px) translateX(-50%)` }}
          >
            {formatPercent(other)}
            {" "}
            {content("SchoolPage.StudentDemographics.gender.genderChartLabels.other")}
          </div>
        )}
      </div>
    </div>
  );
}
