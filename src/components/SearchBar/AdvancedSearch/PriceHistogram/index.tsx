"use client";

import { useId, useRef, useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useResizeObserver } from "usehooks-ts";
import get from "lodash/get";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { line } from "d3-shape";
import { usePriceHistogram } from "@/hooks/usePriceHistogram";
import type { IncomeBracketKey } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 1, right: 10, bottom: 1, left: 10 };

export default function PriceHistogram(props: {
  bracket?: IncomeBracketKey;
  minPrice: number;
  maxPrice?: number;
  updateMinPrice: (price: number) => void;
  updateMaxPrice: (price: number) => void;
}) {
  const {
    bracket = "average",
  } = props;

  const { data: bracketBins } = usePriceHistogram();

  const id = useId();

  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 60;

  const {
    x,
    y,
    path,
  } = useMemo(() => {
    const bins = bracketBins[bracket];

    const binMax = get(bins, [bins.length - 1, "x1"], 1);
    const x = scaleLinear()
      .domain([0, binMax])
      .range([margin.left, width - margin.right]);
    const y = scaleLinear()
      .domain([0, max(bins, (d) => d.length) || 1])
      .range([height - margin.bottom, margin.top]);

    const points = [[0, 0]];
    bins.forEach((bin) => {
      points.push([bin.x0!, bin.length]);
      points.push([bin.x1!, bin.length]);
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
  }, [bracketBins, width, height, bracket]);

  const maxPriceValue = props.maxPrice || x.domain()[1];

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
                x={x(props.minPrice)}
                y={0}
                width={x(maxPriceValue) - x(props.minPrice)}
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
            x1={x(props.minPrice)}
            y1={y.range()[0]}
            x2={x(props.minPrice)}
            y2={y.range()[1]}
            className={styles.minMaxLine}
          />
          <line
            x1={x(maxPriceValue)}
            y1={y.range()[0]}
            x2={x(maxPriceValue)}
            y2={y.range()[1]}
            className={styles.minMaxLine}
          />
        </svg>

        <div className={styles.inputs}>
          <Slider.Root
            className={styles.sliderRoot}
            value={[props.minPrice, maxPriceValue]}
            min={0}
            max={x.domain()[1]}
            onValueChange={([newMin, newMax]) => {
              props.updateMinPrice(newMin);
              props.updateMaxPrice(Math.max(newMin, newMax));
            }}
          >
            <Slider.Track className={styles.sliderTrack}>
              <Slider.Range className={styles.sliderRange} />
            </Slider.Track>
            <Slider.Thumb className={styles.sliderThumb} aria-label="Minimum price" />
            <Slider.Thumb className={styles.sliderThumb} aria-label="Maximum price" />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
}
