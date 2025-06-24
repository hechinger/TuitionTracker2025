import { scaleLinear } from "d3-scale";
import { arc } from "d3-shape";
import styles from "./styles.module.scss";

export default function DonutChart(props: {
  value: number;
  label: string;
  color?: string;
  title?: string;
  benchmark?: number;
  benchmarkLabel?: string;
}) {
  const width = 200;
  const height = width;

  const scale = scaleLinear()
    .domain([0, 1])
    .range([0, 2 * Math.PI]);

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

  const segment = arc<typeof data[keyof typeof data]>()
    .innerRadius((width / 2) - 40)
    .outerRadius(width / 2);

  const text = props.value.toLocaleString(undefined, {
    style: 'percent',
  });

  const color = props.color || "steelblue";

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
          <g transform={`translate(${width / 2}, ${width /2})`}>
            {data.map((d, i) => (
              <path
                key={i}
                d={segment(d) || ""}
                fill={i === 0 ? color : "#ccc"}
              />
            ))}
          </g>
        </svg>

        <div className={styles.number}>
          <span
            className={styles.bigNumber}
            style={{ color }}
          >
            {text}
          </span>
          <span className={styles.smallLabel}>
            {props.label}
          </span>
        </div>
      </div>
    </div>
  );
}
