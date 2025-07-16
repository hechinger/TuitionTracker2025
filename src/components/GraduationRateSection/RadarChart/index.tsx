"use client";

import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { lineRadial, curveLinearClosed } from "d3-shape";
import { useContent } from "@/hooks/useContent";
import OutlineFilter from "@/components/OutlineFilter";
import { formatPercent } from "@/utils/formatPercent";
import { getGraduation } from "@/utils/formatSchoolInfo";
import { isNotUndefined } from "@/utils/isNotUndefined";
import { type SchoolDetail } from "@/types";
import a11y from "@/styles/accessibility.module.scss";
import styles from "./styles.module.scss";

const categories = [
  {
    key: "amerindalasknat",
  },
  {
    key: "asian",
  },
  {
    key: "black",
  },
  {
    key: "hisp",
  },
  {
    key: "nathawpacisl",
  },
  {
    key: "white",
  },
  {
    key: "multiple",
  },
  // {
  //   key: "nonresident",
  // },
  {
    key: "unknown",
  },
] as const;

const nationalAverage = {
  "4-year": {
    amerindalasknat: 0.4267,
    asian: 0.5677,
    black: 0.4036,
    hisp: 0.4790,
    nathawpacisl: 0.4656,
    white: 0.5439,
    multiple: 0.4700,
    nonresident: 0.4901,
    unknown: 0.5556,
  },
  "2-year": {
    amerindalasknat: 0.3244,
    asian: 0.4727,
    black: 0.3008,
    hisp: 0.3987,
    nathawpacisl: 0.3367,
    white: 0.4510,
    multiple: 0.3505,
    nonresident: 0.3737,
    unknown: 0.4031,
  },
};

type DataPoint = {
  key: string;
  label?: string;
  value: number;
};

export default function RadarChart(props: {
  school: SchoolDetail;
}) {
  const content = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { width: w = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const width = Math.min(w, 400);
  const height = width;

  const minLabelValue = 0.1;
  const labelValue = (value: number) => Math.max(minLabelValue, value);

  const graduation = getGraduation(props.school);
  const data = categories.map((c) => {
    const value = graduation.byRace[c.key];
    if (typeof value !== "number") return undefined;
    return {
      key: c.key,
      label: content(`GeneralPurpose.demographicCategories.${c.key}`),
      value: graduation.byRace[c.key],
    };
  }).filter(isNotUndefined);
  const natAvg = nationalAverage[props.school.degreeLevel];
  const natAvgData = data.map((d) => ({
    key: d.key,
    label: d.label,
    value: natAvg[d.key],
  }));

  const spokeLength = (width / 2) - 50;
  const angle = scaleOrdinal<string, number>()
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

  const getLabelAlignTransform = (angle: number, value?: number) => {
    const unitVector = getXY(angle, 1);
    if (value === undefined || value < 0.6) {
      return [
        `translate(${unitVector.x * 50}%, ${unitVector.y * 50}%)`,
        `translate(${unitVector.x * 8}px, ${unitVector.y * 8}px)`,
      ].join(' ');
    }
    return [
      `translate(${unitVector.x * -50}%, ${unitVector.y * -50}%)`,
      `translate(${unitVector.x * -8}px, ${unitVector.y * -8}px)`,
    ].join(' ');
  };

  const getNatAvgLabelTransform = () => {
    const angleStep = (2 * Math.PI) / data.length;
    const labelAngle = (2 * Math.PI) - (angleStep / 2);
    const r1 = r(natAvgData[0].value);
    const r2 = r(natAvgData[natAvgData.length - 1].value);
    const labelR =  (r1 + r2) / 2;
    const pos = getXY(labelAngle, labelR);
    if (
      data[0].value > natAvgData[0].value
        || data[data.length - 1].value > natAvgData[natAvgData.length - 1].value
    ) {
      return [
        `translate(${width / 2}px, ${height / 2}px)`,
        `translateX(${pos.x}px)`,
        `translateY(${pos.y}px)`,
        "translate(-2px, 10px)",
      ].join(' ');
    }
    return [
      `translate(${width / 2}px, ${height / 2}px)`,
      `translateX(${pos.x}px)`,
      `translateY(${pos.y}px)`,
      "translate(-50%, -100%)",
      "translate(-8px, 0px)",
    ].join(' ');
  };

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

            <path
              d={line(natAvgData) || ""}
              className={styles.natAvgRing}
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
                  `translateX(${getXY(angle(d.key), spokeLength).x}px)`,
                  `translateY(${getXY(angle(d.key), spokeLength).y}px)`,
                  `translate(-50%, -50%)`,
                  getLabelAlignTransform(angle(d.key)),
                ].join(' '),
              }}
            >
              {d.label}
            </div>
          ))}

          <div
            className={styles.natAvgLabel}
            style={{
              transform: getNatAvgLabelTransform(),
            }}
          >
            <OutlineFilter>
              Nat’l avg.
            </OutlineFilter>
          </div>

          {data.map((d) => (
            <div
              key={d.key}
              className={styles.dataLabel}
              style={{
                transform: [
                  `translate(${width / 2}px, ${height / 2}px)`,
                  `translateX(${getXY(angle(d.key), r(labelValue(d.value))).x}px)`,
                  `translateY(${getXY(angle(d.key), r(labelValue(d.value))).y}px)`,
                  `translate(-50%, -50%)`,
                  getLabelAlignTransform(angle(d.key), labelValue(d.value)),
                ].join(' '),
              }}
            >
              <OutlineFilter>
                {formatPercent(d.value)}
              </OutlineFilter>
            </div>
          ))}
        </div>
      </div>

      <div className={a11y.srOnly}>
        <table>
          <thead>
            <tr>
              <th>Demographic category</th>
              <th>Graduation rate at {props.school.name}</th>
              <th>National average</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key}>
                <td>{d.label}</td>
                <td>{formatPercent(d.value)}</td>
                <td>{formatPercent(natAvg[d.key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
