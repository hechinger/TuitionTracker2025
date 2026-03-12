"use client";

import { usePriceHistogram } from "@/hooks/usePriceHistogram";
import type { IncomeBracketKey } from "@/types";
import RangeHistogram from "../RangeHistogram";

export default function PriceHistogram(props: {
  bracket?: IncomeBracketKey;
  minPrice: number;
  maxPrice?: number;
  updateMinPrice: (price: number) => void;
  updateMaxPrice: (price: number) => void;
}) {
  const { bracket = "average" } = props;
  const { data: bracketBins } = usePriceHistogram();
  const bins = bracketBins[bracket];

  return (
    <RangeHistogram
      bins={bins}
      min={props.minPrice}
      max={props.maxPrice}
      onChangeMin={props.updateMinPrice}
      onChangeMax={props.updateMaxPrice}
      minLabel="Minimum price"
      maxLabel="Maximum price"
    />
  );
}
