"use client";

import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import get from "lodash/get";
import { formatPercent } from "@/utils/formatPercent";
import { clamp } from "@/utils/clamp";
import { type SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 24, right: 0, bottom: 20, left: 0 };
const nationalAverage = 0.6; // FIXME

export default function OverallBar(props: {
  school: SchoolDetail;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 80;

  const x = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  const gradRate = get(props.school, "graduationBachelors.total", 0);
  const label = formatPercent(gradRate);
  const natAvgLabel = formatPercent(nationalAverage);

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
        <rect
          x={x(0)}
          y={margin.top}
          width={x(gradRate)}
          height={height - margin.top - margin.bottom}
          className={styles.dataBar}
        />

        <line
          x1={x(nationalAverage)}
          y1={margin.top}
          x2={x(nationalAverage)}
          y2={height - margin.bottom + 6}
          className={styles.nationalAvg}
        />
      </svg>

      <div className={styles.annotation}>
        <div
          className={styles.label}
          style={{ transform: `translateX(${x(clamp(0.2, gradRate, 0.8))}px) translateX(-50%)` }}
        >
          {label} graduation rate
        </div>

        <div
          className={styles.nationalAvgLabel}
          style={{ transform: `translateX(${x(clamp(0.2, nationalAverage, 0.8))}px) translateX(-50%)` }}
        >
          Nat’l avgerage: {natAvgLabel}
        </div>
      </div>
    </div>
  );
}
