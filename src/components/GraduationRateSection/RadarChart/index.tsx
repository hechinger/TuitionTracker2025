"use client";

import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { lineRadial, curveLinearClosed } from "d3-shape";
import { type SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

const categories = [
  {
    key: "amerindalasknat",
    label: "American Indian/Alaska Native",
  },
  {
    key: "asian",
    label: "Asian",
  },
  {
    key: "black",
    label: "Black",
  },
  {
    key: "hisp",
    label: "Hispanic",
  },
  {
    key: "nathawpacisl",
    label: "Native Hawaiian/Pacific Islander",
  },
  {
    key: "white",
    label: "White",
  },
  {
    key: "multiple",
    label: "Two or more races",
  },
  // {
  //   key: "nonresident",
  //   label: "Nonresident",
  // },
  {
    key: "unknown",
    label: "Unknown",
  },
];

type DataPoint = {
  key: string;
  label: string;
  value: number;
};

export default function RadarChart(props: {
  school: SchoolDetail;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { width: w = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const width = Math.min(w, 400);
  const height = width;

  const data = categories.map((c) => ({
    key: c.key,
    label: c.label,
    value: props.school.graduationBachelors.byRace[c.key],
  }));

  const spokeLength = (width / 2) - 30;
  const angle = scaleOrdinal()
    .domain(data.map((c) => c.key))
    .range(data.map((_, i) => i * ((2 * Math.PI) / data.length)));
  const r = scaleLinear()
    .domain([0, 1])
    .range([0, spokeLength]);

  const line = lineRadial<DataPoint>()
    .angle((d) => angle(d.key) || 0)
    .radius((d) => r(d.value) || 0)
    .curve(curveLinearClosed);

  const getXY = (angle: number, radius: number) => {
    const x = Math.cos(angle - (Math.PI / 2)) * radius;
    const y = Math.sin(angle - (Math.PI / 2)) * radius;
    return { x, y };
  };

  const r100 = data.map((c) => ({
    key: c.key,
    label: c.label,
    value: 1,
  }));

  const r50 = data.map((c) => ({
    key: c.key,
    label: c.label,
    value: 0.5,
  }));

  return (
    <div
      ref={ref}
      className={styles.chart}
    >
      <div
        className={styles.plot}
        style={{ width, height }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className={styles.canvas}
        >
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            <path
              d={line(r100) || ""}
              className={styles.axisRing}
            />

            <path
              d={line(r50) || ""}
              className={styles.axisRing}
            />

            {data.map((d) => (
              <line
                key={d.key}
                x1={0}
                y1={0}
                x2={getXY(angle(d.key), spokeLength).x}
                y2={getXY(angle(d.key), spokeLength).y}
                className={styles.axisSpoke}
              />
            ))}

            <path
              d={line(data) || ""}
              className={styles.dataRing}
            />
            {data.map((d) => (
              <circle
                key={d.key}
                cx={getXY(angle(d.key), r(d.value)).x}
                cy={getXY(angle(d.key), r(d.value)).y}
                r="4"
                className={styles.dataPoint}
              />
            ))}
          </g>
        </svg>

        <div
          className={styles.annotation}
        >
          {data.map((d) => (
            <div
              key={d.key}
              className={styles.categoryLabel}
              style={{
                transform: [
                  `translate(${width / 2}px, ${height / 2}px)`,
                  `translateX(${getXY(angle(d.key), width / 2).x}px)`,
                  `translateY(${getXY(angle(d.key), height / 2).y}px)`,
                  `translate(-50%, -50%)`,
                ].join(' '),
              }}
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
