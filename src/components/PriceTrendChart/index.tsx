import { useRef, useMemo } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import { max, extent } from "d3-array";
import { line } from "d3-shape";
import get from "lodash/get";
import type { YearData, SchoolDetail } from "@/types";
import styles from "./styles.module.scss";

const margin = { top: 20, right: 20, bottom: 30, left: 50 };

export default function PriceTrendChart(props: {
  school: SchoolDetail | undefined;
}) {
  const { school } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 400;

  const {
    y,
    getPath,
  } = useMemo(() => {
    if (!school) {
      return {
        x: scaleLinear(),
        y: scaleLinear(),
        getPath: () => "",
      };
    }

    const years = school.years.map((year) => year.startYear);
    const prices = school.years.map((year) => year.stickerPrice.price);

    const x = scaleLinear()
      .domain(extent(years) as [number, number])
      .range([margin.left, width - margin.right]);
    const y = scaleLinear()
      .domain([0, max(prices) || 0])
      .range([height - margin.bottom, margin.top]);

    const getPath = (key: string) => {
      const path = line<YearData>()
        .x((d) => x(d.startYear))
        .y((d) => y(get(d, key)));
      return path(school.years) || "";
    };

    return {
      x,
      y,
      getPath,
    };
  }, [school, width, height]);

  return (
    <div ref={ref}>
      {school && (
        <svg
          className={styles.canvas}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g>
            {y.ticks(4).map((tick) => (
              <line
                key={tick}
                x1={margin.left}
                y1={y(tick)}
                x2={width - margin.right}
                y2={y(tick)}
                stroke={tick === 0 ? "black" : "#ccc"}
              />
            ))}
          </g>

          <path
            d={getPath("stickerPrice.price")}
            fill="none"
            stroke="steelblue"
            strokeWidth={2}
          />

          <path
            d={getPath("netPricesByBracket.average.price")}
            fill="none"
            stroke="pink"
            strokeWidth={2}
          />
        </svg>
      )}
    </div>
  );
}
