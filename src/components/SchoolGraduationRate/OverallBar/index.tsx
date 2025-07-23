"use client";

import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import get from "lodash/get";
import { useContent } from "@/hooks/useContent";
import { formatPercent } from "@/utils/formatPercent";
import { getAlignmentTransform } from "@/utils/getAlignmentTransform";
import { getGraduation } from "@/utils/formatSchoolInfo";
import Robotext from "@/components/Robotext";
import type { SchoolDetail, NationalAverages } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 24, right: 0, bottom: 20, left: 0 };

export default function OverallBar(props: {
  school: SchoolDetail;
  nationalAverages: NationalAverages;
}) {
  const content = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 80;

  const nationalAverage = get(props.nationalAverages, [
    props.school.degreeLevel,
    "graduationTotal",
  ]);

  const x = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  const gradRate = get(getGraduation(props.school), "total", 0);
  const label = formatPercent(gradRate);
  const natAvgLabel = formatPercent(nationalAverage);

  const labelAlignment = getAlignmentTransform({
    min: 0.2,
    value: gradRate,
    max: 0.8,
  });
  const natLabelAlignment = getAlignmentTransform({
    min: 0.2,
    value: nationalAverage,
    max: 0.8,
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
          style={{ transform: `translateX(${x(gradRate)}px) ${labelAlignment}` }}
        >
          <Robotext
            as="span"
            template={content("SchoolPage.GraduationRates.overallBarLabel")}
            context={{
              GRADUATION_RATE: label,
            }}
          />
        </div>

        <div
          className={styles.nationalAvgLabel}
          style={{ transform: `translateX(${x(nationalAverage)}px) ${natLabelAlignment}` }}
        >
          <Robotext
            as="span"
            template={content("SchoolPage.GraduationRates.nationalAverageBarLabel")}
            context={{
              NATIONAL_AVERAGE: natAvgLabel,
            }}
          />
        </div>
      </div>
    </div>
  );
}
