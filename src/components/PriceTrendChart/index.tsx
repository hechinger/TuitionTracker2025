"use client";

import { useRef, useMemo } from "react";
import clsx from "clsx";
import { useResizeObserver } from "usehooks-ts";
import { scaleLinear } from "d3-scale";
import { max, extent } from "d3-array";
import { line, area } from "d3-shape";
import get from "lodash/get";
import { formatDollars } from "@/utils/formatDollars";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import { useContent } from "@/hooks/useContent";
import type { YearData, SchoolDetail } from "@/types";
import a11y from "@/styles/accessibility.module.scss";
import Legend from "./Legend";
import { useFixLabelOverlap } from "./useFixLabelOverlap";
import styles from "./styles.module.scss";

export default function PriceTrendChart(props: {
  school: SchoolDetail | undefined;
  max?: number;
  lineLabels?: boolean;
  legend?: boolean;
}) {
  const {
    school,
    lineLabels = true,
    legend = true,
  } = props;

  const annotationsRef = useFixLabelOverlap<HTMLDivElement>();

  const content = useContent();
  const { bracket = "average" } = useIncomeBracket();

  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver({ ref: ref as React.RefObject<HTMLElement> });
  const height = 320;

  const xTicks = 4;

  const margin = {
    top: 20,
    right: lineLabels ? 82 : 20,
    bottom: 20,
    left: 40,
  };

  const outStatePrice = school?.stickerPrice.priceOutState;
  const withOutState = (
    school?.schoolControl === "public"
    && !!outStatePrice
  );
  const stickerPriceLabel = withOutState
    ? "SchoolPage.Prices.inStateStickerLabel"
    : "SchoolPage.Prices.stickerLabel";
  const netPriceLabel = withOutState
    ? "SchoolPage.Prices.inStateNetPriceLabel"
    : "SchoolPage.Prices.netPriceLabel";

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

    const getMaxPrice = (year: YearData) => {
      const maxPrice = max([
        (withOutState && year.stickerPrice.priceOutState) || 0,
        year.stickerPrice.price,
        ...Object.values(year.netPricesByBracket).map((b) => b.price || 0),
      ]);
      return maxPrice || 0;
    };

    const years = school.years.map((year) => year.startYear);
    const prices = school.years.map((year) => getMaxPrice(year));

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
          if (!price.min) return y(price.price);
          return y(Math.min(
            price.min * d.stickerPrice.price,
            price.price,
          ));
        })
        .y1((d) => {
          const price = get(d, key);
          if (!price.max) return y(price.price);
          return y(Math.max(
            price.max * d.stickerPrice.price,
            price.price,
          ));
        })
        .defined((d) => {
          const price = get(d, key);
          return typeof price.price === "number";
        });
      return path(school.years) || "";
    };

    return {
      x,
      y,
      getPath,
      getArea,
    };
  }, [
    school,
    withOutState,
    width,
    height,
    props.max,
    margin.top,
    margin.right,
    margin.bottom,
    margin.left,
  ]);

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

                {x.ticks(xTicks).map((tick) => (
                  <line
                    key={tick}
                    x1={x(tick) - 0.5}
                    y1={y(0)}
                    x2={x(tick) - 0.5}
                    y2={y(0) + 4}
                    className={clsx(styles.axisLine, styles.zero)}
                  />
                ))}
              </g>

              {withOutState && (
                <path
                  d={getPath("stickerPrice.priceOutState")}
                  className={styles.stickerOutStateLine}
                />
              )}

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

            <div
              ref={annotationsRef}
              className={styles.annotation}
            >
              {y.ticks(4).filter((tick) => tick !== 0).map((tick) => (
                <div
                  key={tick}
                  className={clsx(styles.yLabel)}
                  style={{ transform: `translateY(${y(tick)}px) translateY(-50%)` }}
                >
                  {formatDollars(tick, { abbreviate: true })}
                </div>
              ))}

              {x.ticks(xTicks).map((tick, i, ts) => (
                <div
                  key={tick}
                  className={clsx(styles.xLabel)}
                  style={{ transform: `translateX(${x(tick)}px) translateX(${i === ts.length - 1 ? "-100%" : "-50%"})` }}
                >
                  {`${tick.toString().slice(2)}-${(tick + 1).toString().slice(2)}`}
                </div>
              ))}

              {lineLabels && (
                <>
                  {withOutState && (
                    <div
                      className={styles.dataLabel}
                      style={{
                        transform: `translateY(${y(outStatePrice)}px) translate(-${margin.right - 4}px, -18px)`,
                      }}
                      data-overlap={outStatePrice}
                    >
                      <strong>{formatDollars(outStatePrice)}</strong>
                      <br />
                      {content("SchoolPage.Prices.outOfStateStickerLabel")}
                    </div>
                  )}

                  <div
                    className={styles.dataLabel}
                    style={{
                      transform: `translateY(${y(school.stickerPrice.price)}px) translate(-${margin.right - 4}px, -18px)`,
                    }}
                    data-overlap={school.stickerPrice.price}
                  >
                    <strong>{formatDollars(school.stickerPrice.price)}</strong>
                    <br />
                    {content(stickerPriceLabel)}
                  </div>

                  <div
                    className={styles.dataLabel}
                    style={{
                      transform: `translateY(${y(school.netPricesByBracket[bracket])}px) translate(-${margin.right - 4}px, -18px)`,
                    }}
                    data-overlap={school.netPricesByBracket[bracket]}
                  >
                    <strong>{formatDollars(school.netPricesByBracket[bracket])}</strong>
                    <br />
                    {content(netPriceLabel)}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {legend && (
        <Legend />
      )}

      {school && (
        <div className={a11y.srOnly}>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Net in-state price at {school.name}</th>
                <th>In-state sticker price at {school.name}</th>
                {withOutState && (
                  <th>Out-of-state sticker price at {school.name}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {school.years.map((year) => (
                <tr key={year.year}>
                  <td>{year.year}</td>
                  <td>{formatDollars(year.netPricesByBracket[bracket].price)}</td>
                  <td>{formatDollars(year.stickerPrice.price)}</td>
                  {withOutState && (
                    <td>
                      {formatDollars(year.stickerPrice.priceOutState!)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
