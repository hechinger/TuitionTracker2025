"use client";

import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import get from "lodash/get";
import { type SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 24, right: 0, bottom: 0, left: 0 };

export default function OverallBar(props: {
  school: SchoolDetail;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 60;

  const x = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  const gradRate = get(props.school, "graduationBachelors.total", 0);
  const label = gradRate.toLocaleString(undefined, {
    style: "percent",
    maximumFractionDigits: 0,
  });

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
      </svg>

      <div className={styles.annotation}>
        <div
          className={styles.label}
          style={{ transform: `translateX(${x(gradRate)}px) translateX(-50%)` }}
        >
          {label} graduation rate
        </div>
      </div>
    </div>
  );
}
