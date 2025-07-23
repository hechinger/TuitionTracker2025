import { sum } from "d3-array";
import type { ParseContext } from "../utils/parseIpedsFile";

export type RowEFD = {
  RET_NMF: number;
  RRFTCTA: number;
  RET_NMP: number;
  RRPTCTA: number;
};

export const parseEFD = (
  years: RowEFD[][],
  { registerError }: ParseContext,
) => {
  const rows = years.flat();

  const retentionRate = (
    numeratorKey: keyof RowEFD,
    denominatorKey: keyof RowEFD,
  ) => {
    const numerator = sum(rows, (row) => row[numeratorKey]);
    const denominator = sum(rows, (row) => row[denominatorKey]);
    if (!denominator) {
      registerError("Could not compute retention rate");
      return null;
    }
    return numerator / denominator;
  };

  return {
    retention: {
      fullTime: retentionRate("RET_NMF", "RRFTCTA"),
      partTime: retentionRate("RET_NMP", "RRPTCTA"),
    },
  };
};
