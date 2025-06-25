import { useRef, useMemo } from "react";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import { max, bin } from "d3-array";
import { line } from "d3-shape";
import { useSchools } from "@/hooks/useSchools";
import styles from "./styles.module.scss";

const margin = { top: 20, right: 20, bottom: 30, left: 50 };

export default function SizeHistogram(props: {
  size: number;
  title?: string;
}) {
  const { data: schools = [] } = useSchools();

  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 200;

  const {
    // x,
    // y,
    // bins,
    areaPath,
    points,
  } = useMemo(() => {
    const sizes = schools.map((school) => school.enrollment);

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
  }, [schools, width, height]);

  return (
    <div>
      {props.title && (
        <h3>{props.title}</h3>
      )}

      <div ref={ref}>
        <svg
          className={styles.canvas}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <path
            d={areaPath(points) || ""}
            fill="#ccc"
            stroke="black"
          />
        </svg>
      </div>
    </div>
  );
}
