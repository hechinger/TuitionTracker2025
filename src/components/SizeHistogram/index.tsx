"use client";

import { useRef, useMemo } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import { max, bin } from "d3-array";
import { line } from "d3-shape";
import { useSchools } from "@/hooks/useSchools";
import { getAlignmentTransform } from "@/utils/getAlignmentTransform";
import type { SchoolControl, DegreeLevel } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 30, right: 10, bottom: 20, left: 10 };

/**
 * The school size histogram that shows up on the school detail page and on
 * the school comparison page. It can optionally reduce the set of schools
 * based on a school control and/or degree level.
 * 
 * @param props.size
 *   The size of the school being highlighted
 * @param props.title
 *   An optional title to render over the histogram
 * @param props.schoolControl
 *   An optional school control to limit the comparison to
 * @param props.degreeLevel
 *   An optional degree level to limit the comparison to
 */
export default function SizeHistogram(props: {
  size: number;
  title?: string;
  schoolControl?: SchoolControl;
  degreeLevel?: DegreeLevel;
}) {
  const {
    schoolControl,
    degreeLevel,
  } = props;

  const { data: schools = [] } = useSchools();

  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });

  const chartHeight = 60;
  const height = chartHeight + margin.top + margin.bottom;

  const {
    x,
    y,
    // bins,
    areaPath,
    points,
  } = useMemo(() => {
    const sizes = schools
      .filter((school) => {
        if (!school.enrollment) return false;
        const isControl = !schoolControl || (schoolControl === school.schoolControl);
        const isLevel = !degreeLevel || (degreeLevel === school.degreeLevel);
        return isControl && isLevel;
      })
      .map((school) => school.enrollment);

    const binSize = 500;
    const binMax = max(sizes) || 0;
    const binN = Math.ceil(binMax / binSize);

    const binner = bin()
      .value((d) => Math.min(d, binMax))
      .thresholds([...Array(binN)].map((_, i) => binSize * (i + 1)));
    const bins = binner(sizes);

    const x = scaleLinear()
      .domain([0, binMax + binSize])
      .range([margin.left, width - margin.right]);
    const y = scaleLinear()
      .domain([0, max(bins, (d) => d.length) || 0])
      .range([height - margin.bottom, margin.top]);

    const points = [[0, 0]];
    bins.forEach((bin, i) => {
      points.push([i * binSize, bin.length]);
      points.push([(i + 1) * binSize, bin.length]);
    });
    points.push([binMax + binSize, 0]);

    const areaPath = line<number[]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    return {
      x,
      y,
      bins,
      points,
      areaPath,
    };
  }, [schools, width, height, schoolControl, degreeLevel]);

  const [lab1, lab2] = x.domain();
  const dataLabelPosition = props.size;
  const dataLabelAlignment = getAlignmentTransform({
    min: x.domain()[1] * 0.2,
    value: dataLabelPosition,
    max: x.domain()[1] * 0.8,
  });

  return (
    <div>
      {props.title && (
        <h3>{props.title}</h3>
      )}

      <div
        ref={ref}
        className={styles.plot}
      >
        <svg
          className={styles.canvas}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <path
            d={areaPath(points) || ""}
            className={styles.histogram}
          />

          <line
            x1={x(props.size)}
            y1={margin.top - 10}
            x2={x(props.size)}
            y2={height - margin.bottom}
            className={styles.dataLine}
          />

          <line
            x1={x.range()[0] - 4}
            y1={y(0) + 0.5}
            x2={x.range()[1] + 4}
            y2={y(0) + 0.5}
            className={styles.axis}
          />
        </svg>

        <div className={styles.annotation}>
          <div
            className={styles.label}
            style={{
              transform: `translateX(${x(lab1)}px)`,
            }}
          >
            {lab1.toLocaleString()} students
          </div>

          <div
            className={styles.label}
            style={{
              transform: `translateX(${x(lab2)}px) translateX(-100%)`,
            }}
          >
            {lab2.toLocaleString()} students
          </div>

          <div
            className={styles.dataLabel}
            style={{
              transform: `translateX(${x(dataLabelPosition)}px) ${dataLabelAlignment}`,
            }}
          >
            {props.size.toLocaleString()} students
          </div>
        </div>
      </div>
    </div>
  );
}
