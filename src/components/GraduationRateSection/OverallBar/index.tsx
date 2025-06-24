"use client";

import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear, scaleBand } from "d3-scale";
import get from "lodash/get";
import { type SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

export default function OverallBar(props: {
  school: SchoolDetail;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 100;

  const x = scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  return (
    <div ref={ref}>
      <svg
        width={width}
        height={height}
        className={styles.svg}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#eee"
        />
        <rect
          x={0}
          y={0}
          width={x(get(props.school, "graduationBachelors.total", 0))}
          height={height}
          fill="steelblue"
        />
      </svg>
    </div>
  );
}