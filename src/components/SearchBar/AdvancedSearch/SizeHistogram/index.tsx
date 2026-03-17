"use client";

import { useSizeHistogram } from "@/hooks/useSizeHistogram";
import RangeHistogram from "../RangeHistogram";

export default function SizeHistogram(props: {
  minSize: number;
  maxSize?: number;
  updateMinSize: (size: number) => void;
  updateMaxSize: (size: number) => void;
}) {
  const { data: { bins } } = useSizeHistogram();

  return (
    <RangeHistogram
      bins={bins}
      min={props.minSize}
      max={props.maxSize}
      onChangeMin={props.updateMinSize}
      onChangeMax={props.updateMaxSize}
      minLabel="Minimum enrollment"
      maxLabel="Maximum enrollment"
    />
  );
}
