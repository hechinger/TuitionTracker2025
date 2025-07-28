import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/routes";
import type { HistogramData, SchoolControl, DegreeLevel } from "@/types";

export function useSizeHistogram(opts: {
  schoolControl?: SchoolControl;
  degreeLevel?: DegreeLevel;
} = {}) {
  const {
    schoolControl,
    degreeLevel,
  } = opts;
  return useQuery<{ percentiles: number[], bins: HistogramData[] }>({
    queryKey: ['sizeHistogram', schoolControl, degreeLevel],
    queryFn: async () => {
      const rsp = await fetch(api.sizeHistogram({ schoolControl, degreeLevel }));
      const data = await rsp.json();
      return data;
    },
    initialData: {
      percentiles: [],
      bins: [],
    },
  });
}
