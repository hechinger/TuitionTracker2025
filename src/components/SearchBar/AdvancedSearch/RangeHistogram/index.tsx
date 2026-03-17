"use client";

import { useId, useRef, useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useResizeObserver } from "usehooks-ts";
import get from "lodash/get";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { line } from "d3-shape";
import type { HistogramData } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 1, right: 10, bottom: 1, left: 10 };

export default function RangeHistogram(props: {
  bins: HistogramData[];
  min: number;
  max?: number;
  onChangeMin: (value: number) => void;
  onChangeMax: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const id = useId();

  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 60;

  const {
    x,
    y,
    path,
  } = useMemo(() => {
    const binMax = get(props.bins, [props.bins.length - 1, "x1"], 1);
    const x = scaleLinear()
      .domain([0, binMax])
      .range([margin.left, width - margin.right]);
    const y = scaleLinear()
      .domain([0, max(props.bins, (d) => d.length) || 1])
      .range([height - margin.bottom, margin.top]);

    const points = [[0, 0]];
    props.bins.forEach((bin) => {
      points.push([bin.x0, bin.length]);
      points.push([bin.x1, bin.length]);
    });
    points.push([binMax, 0]);

    const areaPath = line<number[]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    return {
      x,
      y,
      path: areaPath(points) || "",
    };
  }, [props.bins, width, height]);

  const maxValue = props.max || x.domain()[1];

  return (
    <div
      ref={ref}
      className={styles.container}
    >
      <div className={styles.plot}>
        <svg
          className={styles.canvas}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <clipPath id={`clip-path-${id}`}>
              <rect
                x={x(props.min)}
                y={0}
                width={x(maxValue) - x(props.min)}
                height={height}
              />
            </clipPath>
          </defs>
          <path
            d={path}
            className={styles.bgArea}
          />
          <path
            d={path}
            className={styles.selectedArea}
            clipPath={`url(#clip-path-${id})`}
          />

          <line
            x1={x(props.min)}
            y1={y.range()[0]}
            x2={x(props.min)}
            y2={y.range()[1]}
            className={styles.minMaxLine}
          />
          <line
            x1={x(maxValue)}
            y1={y.range()[0]}
            x2={x(maxValue)}
            y2={y.range()[1]}
            className={styles.minMaxLine}
          />
        </svg>

        <div className={styles.inputs}>
          <Slider.Root
            className={styles.sliderRoot}
            value={[props.min, maxValue]}
            min={0}
            max={x.domain()[1]}
            onValueChange={([newMin, newMax]) => {
              const sliderMax = x.domain()[1];
              props.onChangeMin(newMin);
              props.onChangeMax(newMax >= sliderMax ? 0 : Math.max(newMin, newMax));
            }}
          >
            <Slider.Track className={styles.sliderTrack}>
              <Slider.Range className={styles.sliderRange} />
            </Slider.Track>
            <Slider.Thumb className={styles.sliderThumb} aria-label={props.minLabel} />
            <Slider.Thumb className={styles.sliderThumb} aria-label={props.maxLabel} />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
}
