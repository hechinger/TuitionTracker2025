import { area } from "d3-shape";
import styles from "./styles.module.scss";

export default function Legend() {
  const width = 120;
  const height = 60;

  const step = width / 3;

  const points = [
    {
      x: step,
      y0: height / 2,
      y1: height / 2,
    },
    {
      x: step * 2,
      y0:  0.9 * height,
      y1: 0.1 * height,
    },
    {
      x: width,
      y0:  height,
      y1: 0,
    },
  ];

  const line = area<{ x: number, y0: number, y1: number }>()
    .x((d) => d.x)
    .y0((d) => d.y0)
    .y1((d) => d.y1);

  return (
    <div className={styles.legend}>
      <div className={styles.svgWrapper}>
        <svg width={width} height={height}>
          <path
            d={line(points) || ""}
            className={styles.area}
          />
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            className={styles.line}
          />
        </svg>
      </div>

      <div className={styles.labels}>
        <div className={styles.estimation}>Upper net price estimation</div>
        <div className={styles.projection}>Projected net price</div>
        <div className={styles.estimation}>Lower net price estimation</div>
      </div>
    </div>
  );
}
