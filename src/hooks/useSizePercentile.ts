import { useSizeHistogram } from "@/hooks/useSizeHistogram";
import type { SchoolControl, DegreeLevel } from "@/types";

export function useSizePercentile({
  size,
  schoolControl,
  degreeLevel,
}: {
  size: number;
  schoolControl?: SchoolControl;
  degreeLevel?: DegreeLevel;
}) {
  const { data: { percentiles } } = useSizeHistogram({
    schoolControl,
    degreeLevel,
  });
  console.log(percentiles);
  const percentile = percentiles.findLastIndex((d) => d < size);
  return percentile / 100;
}
