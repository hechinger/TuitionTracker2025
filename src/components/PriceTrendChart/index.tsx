import { useRef, useMemo } from "react";
import clsx from "clsx";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import { max, extent } from "d3-array";
import { line, area } from "d3-shape";
import get from "lodash/get";
import { formatDollars } from "@/utils/formatDollars";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import type { YearData, SchoolDetail } from "@/types";
import Legend from "./Legend";
import styles from "./styles.module.scss";

const margin = { top: 20, right: 60, bottom: 20, left: 80 };

export default function PriceTrendChart(props: {
  school: SchoolDetail | undefined;
  max?: number;
}) {
  const { school } = props;

  console.log(school);

  const { bracket = "average" } = useIncomeBracket();

  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 320;

  const {
    x,
    y,
    getPath,
    getArea,
  } = useMemo(() => {
    if (!school) {
      return {
        x: scaleLinear(),
        y: scaleLinear(),
        getPath: () => "",
        getArea: () => "",
      };
    }

    const years = school.years.map((year) => year.startYear);
    const prices = school.years.map((year) => year.stickerPrice.price);

    const x = scaleLinear()
      .domain(extent(years) as [number, number])
      .range([margin.left, width - margin.right]);
    const y = scaleLinear()
      .domain([0, props.max || max(prices) || 0])
      .range([height - margin.bottom, margin.top])
      .nice();

    const getPath = (key: string) => {
      const path = line<YearData>()
        .x((d) => x(d.startYear))
        .y((d) => y(get(d, key)));
      return path(school.years) || "";
    };

    const getArea = (key: string) => {
      const path = area<YearData>()
        .x((d) => x(d.startYear))
        .y0((d) => {
          const price = get(d, key);
          if (price.min === undefined) return y(price.price);
          return y(Math.min(
            price.min * d.stickerPrice.price,
            price.price,
          ));
        })
        .y1((d) => {
          const price = get(d, key);
          if (price.max === undefined) return y(price.price);
          return y(Math.max(
            price.max * d.stickerPrice.price,
            price.price,
          ));
        });
      return path(school.years) || "";
    };

    return {
      x,
      y,
      getPath,
      getArea,
    };
  }, [school, width, height, props.max]);

  return (
    <div className={styles.legendWrapper}>
      <div ref={ref} className={styles.container}>
        {school && (
          <div className={styles.plot}>
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
                    x1={0}
                    y1={y(tick)}
                    x2={width - margin.right}
                    y2={y(tick)}
                    className={clsx(styles.axisLine, { [styles.zero]: tick === 0 })}
                  />
                ))}
              </g>

              <path
                d={getPath("stickerPrice.price")}
                className={styles.stickerLine}
              />

              <path
                d={getArea(`netPricesByBracket.${bracket}`)}
                className={styles.netArea}
              />
              <path
                d={getPath(`netPricesByBracket.${bracket}.price`)}
                className={styles.netLine}
              />
            </svg>

            <div className={styles.annotation}>
              {y.ticks(4).filter((tick) => tick !== 0).map((tick) => (
                <div
                  key={tick}
                  className={clsx(styles.yLabel)}
                  style={{ transform: `translateY(${y(tick)}px) translateY(-50%)` }}
                >
                  {formatDollars(tick, { round: true })}
                </div>
              ))}

              {x.ticks(4).map((tick) => (
                <div
                  key={tick}
                  className={clsx(styles.xLabel)}
                  style={{ transform: `translateX(${x(tick)}px) translateX(-50%)` }}
                >
                  {`${tick.toString().slice(2)}-${(tick + 1).toString().slice(2)}`}
                </div>
              ))}

              <div
                className={styles.dataLabel}
                style={{
                  transform: `translateY(${y(school.stickerPrice.price)}px) translate(-${margin.right - 4}px, -18px)`,
                }}
              >
                <strong>{formatDollars(school.stickerPrice.price)}</strong> sticker price
              </div>

              <div
                className={styles.dataLabel}
                style={{
                  transform: `translateY(${y(school.netPricesByBracket[bracket])}px) translate(-${margin.right - 4}px, -18px)`,
                }}
              >
                <strong>{formatDollars(school.netPricesByBracket[bracket])}</strong> net price
              </div>
            </div>
          </div>
        )}
      </div>
      <Legend />
    </div>
  );
}
