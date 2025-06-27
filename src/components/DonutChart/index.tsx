import { scaleLinear } from "d3-scale";
import { arc } from "d3-shape";
import { formatPercent } from "@/utils/formatPercent";
import styles from "./styles.module.scss";

const margin = 6;

export default function DonutChart(props: {
  value: number;
  label: string;
  title?: string;
  benchmark?: number;
  benchmarkLabel?: string;
}) {
  const width = 212;
  const height = width;

  const scale = scaleLinear()
    .domain([0, 1])
    .range([2 * Math.PI, 0]);

  const data = [
    {
      startAngle: scale(0),
      endAngle: scale(props.value),
    },
    {
      startAngle: scale(props.value),
      endAngle: scale(1),
    },
  ];

  const thickness = 40;
  const outerRadius = width / 2 - margin;
  const innerRadius = outerRadius - thickness;
  const segment = arc<typeof data[keyof typeof data]>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const getXY = (angle: number, radius: number) => {
    const x = Math.cos(angle - (Math.PI / 2)) * radius;
    const y = Math.sin(angle - (Math.PI / 2)) * radius;
    return { x, y };
  };

  const tickStart = getXY(data[0].endAngle, innerRadius - 6);
  const tickEnd = getXY(data[0].endAngle, outerRadius);

  const benchmarkStart = getXY(scale(props.benchmark || 0), innerRadius);
  const benchmarkEnd = getXY(scale(props.benchmark || 0), outerRadius + 6);

  return (
    <div className={styles.donutContainer}>
      {props.title && (
        <h3>{props.title}</h3>
      )}

      <div className={styles.donut}>
        <svg
          width={width}
          height={height}
          className={styles.canvas}
        >
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {data.map((d, i) => (
              <path
                key={i}
                d={segment(d) || ""}
                className={i === 0 ? styles.dataSegment : styles.bgSegment}
              />
            ))}

            <line
              x1={tickStart.x}
              y1={tickStart.y}
              x2={tickEnd.x}
              y2={tickEnd.y}
              className={styles.tick}
            />

            {props.benchmark !== undefined && (
              <line
                x1={benchmarkStart.x}
                y1={benchmarkStart.y}
                x2={benchmarkEnd.x}
                y2={benchmarkEnd.y}
                className={styles.benchmark}
              />
            )}
          </g>
        </svg>

        <div className={styles.number}>
          <span
            className={styles.bigNumber}
          >
            {formatPercent(props.value)}
          </span>
          <span className={styles.smallLabel}>
            {props.label}
          </span>
        </div>

        <div className={styles.annotation}>
          {props.benchmarkLabel && (
            <div
              className={styles.benchmark}
              style={{
                top: benchmarkEnd.y,
                left: benchmarkEnd.x,
                transform: `translate(-25%, 0%) translate(${width / 2}px, ${height / 2}px)`,
              }}
            >
              {props.benchmarkLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
