"use client";

import { useMemo, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { useSchool } from "@/hooks/useSchool";
import { scaleLinear, scaleBand } from "d3-scale";
import { max, extent } from "d3-array";
import { line } from "d3-shape";
import get from "lodash/get";
import { type YearData } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const brackets = [
  "0_30000",
  "30001_48000",
  "48001_75000",
  "75001_110000",
  "110001",
];

export default function IncomeBracketBarChart(props: {
  schoolId: string;
}) {
  const { data: school } = useSchool(props.schoolId);
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 400;

  const {
    maxYearData,
    x,
    y,
  } = useMemo(() => {
    if (!school) {
      return {
        x: scaleBand(brackets, [0, 0]),
        y: scaleLinear([0, 0], [0, 0]),
      };
    }

    const [maxYearData] = school.years.slice().sort((a, b) => b.startYear - a.startYear);
    const x = scaleBand()
      .domain(brackets)
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const y = scaleLinear()
      .domain([
        0,
        max(brackets.map((bracket) => maxYearData.netPricesByBracket[bracket].price)) || 0,
      ])
      .range([height - margin.bottom, margin.top]);

    return { maxYearData, x, y };
  }, [school, width, height]);

  return (
    <div>
      {school && (
        <h2>Income Brackets at {school.name}</h2>
      )}
      <div ref={ref}>
        {school && (
          <svg
            className={styles.canvas}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
          >
            <g>
              {brackets.map((bracket) => (
                <rect
                  key={bracket}
                  x={x(bracket) || 0}
                  y={y(maxYearData.netPricesByBracket[bracket].price || 0)}
                  width={x.bandwidth()}
                  height={y(0) - y(maxYearData.netPricesByBracket[bracket].price)}
                  fill="steelblue"
                />
              ))}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}