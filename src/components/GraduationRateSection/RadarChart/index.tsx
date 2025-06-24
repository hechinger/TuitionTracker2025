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

  const angle = scaleOrdinal()
    .domain(data.map((c) => c.key))
    .range(data.map((_, i) => i * ((2 * Math.PI) / data.length)));
  const r = scaleLinear()
    .domain([0, 1])
    .range([0, width / 2]);

  const line = lineRadial<DataPoint>()
    .angle((d) => angle(d.key) || 0)
    .radius((d) => r(d.value) || 0)
    .curve(curveLinearClosed);

  console.log(data.map((d) => ({
    angle: angle(d.key),
    radius: r(d.value),
  })));

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
    <div ref={ref}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <path
            d={line(r100) || ""}
            fill="none"
            stroke="#ccc"
          />

          <path
            d={line(r50) || ""}
            fill="none"
            stroke="#ccc"
          />

          {data.map((d) => (
            <line
              key={d.key}
              x1={0}
              y1={0}
              x2={Math.cos(angle(d.key)) * width / 2}
              y2={Math.sin(angle(d.key)) * width / 2}
              stroke="#ccc"
            />
          ))}

          <path
            d={line(data) || ""}
            fill="none"
            stroke="steelblue"
            strokeWidth={2}
          />
        </g>
      </svg>
    </div>
  );
}
