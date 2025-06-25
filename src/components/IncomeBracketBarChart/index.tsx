"use client";

import { useMemo, useRef } from "react";
import clsx from "clsx";
import { useResizeObserver } from "usehooks-ts";
import { useSchool } from "@/hooks/useSchool";
import { formatDollars } from "@/utils/formatDollars";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import styles from "./styles.module.scss";

const margin = { top: 20, right: 0, bottom: 25, left: 0 };
const brackets = [
  "0_30000",
  "30001_48000",
  "48001_75000",
  "75001_110000",
  "110001",
] as const;
const bracketLabels = {
  "0_30000": "$0-$30K",
  "30001_48000": "$30K-$48K",
  "48001_75000": "$48K-$75K",
  "75001_110000": "$75K-$110K",
  "110001": ">$110K",
} as const;

export default function IncomeBracketBarChart(props: {
  schoolId: string;
}) {
  const { bracket: incomeBracket = "average" } = useIncomeBracket();

  const { data: school } = useSchool(props.schoolId);
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 300;

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
    const x = scaleBand<keyof typeof bracketLabels>()
      .domain(brackets)
      .range([margin.left, width - margin.right])
      .paddingInner(0.2);
    const y = scaleLinear()
      .domain([
        0,
        max(brackets.map((bracket) => maxYearData.netPricesByBracket[bracket].price)) || 0,
      ])
      .range([height - margin.bottom, margin.top]);

    return { maxYearData, x, y };
  }, [school, width, height]);

  return (
    <div className={styles.container}>
      {school && (
        <h2 className={styles.chartTitle}>
          Income Brackets at {school.name}
        </h2>
      )}
      <div ref={ref}>
        {school && maxYearData && (
          <div className={styles.plot}>
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
                    className={clsx(styles.bar, {
                      [styles.highlight]: bracket === incomeBracket,
                      [styles.mute]: incomeBracket !== "average" && bracket !== incomeBracket,
                    })}
                  />
                ))}
              </g>

              <g>
                <line
                  x1={0}
                  y1={y(0) + 5}
                  x2={width}
                  y2={y(0) + 5}
                  className={styles.axisLine}
                />
              </g>
            </svg>

            <div className={styles.annotation}>
              {brackets.map((bracket) => (
                <div
                  key={bracket}
                  className={styles.yLabel}
                  style={{
                    transform: [
                      `translateY(${y(maxYearData.netPricesByBracket[bracket].price || 0)}px)`,
                      "translateY(-100%)",
                      "translateY(-4px)",
                      `translateX(${x(bracket)! + (x.bandwidth() / 2)}px)`,
                      "translateX(-50%)",
                    ].join(' '),
                  }}
                >
                  {formatDollars(maxYearData.netPricesByBracket[bracket].price || 0, { round: true })}
                </div>
              ))}

              {brackets.map((tick) => (
                <div
                  key={tick}
                  className={styles.xLabel}
                  style={{ transform: `translateX(${x(tick)! + (x.bandwidth() / 2)}px) translateX(-50%)` }}
                >
                  {bracketLabels[tick]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
