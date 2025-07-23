import { sum } from "d3-array";
import type { ParseContext } from "../utils/parseIpedsFile";

export type RowGR = {
  GRTYPE: number;
  GRTOTLT: number;
  GRUNKNT: number;
  GR2MORT: number;
  GRWHITT: number;
  GRHISPT: number;
  GRNHPIT: number;
  GRBKAAT: number;
  GRASIAT: number;
  GRAIANT: number;
  GRNRALT: number;
};

export const parseGR = (
  years: RowGR[][],
  { registerError }: ParseContext,
) => {
  const rows = years.flat();
  const numeratorRows = rows.filter((row) => ["9", "30"].includes(`${row.GRTYPE}`));
  const denominatorRows = rows.filter((row) => ["8", "29"].includes(`${row.GRTYPE}`));
  const gradRate = (key: keyof RowGR) => {
    const numerator = sum(numeratorRows, (row) => row[key]);
    const denominator = sum(denominatorRows, (row) => row[key]);
    if (!denominator) {
      registerError("Could not compute graduation rate");
      return null;
    }
    return numerator / denominator;
  };
  return {
    graduation: {
      total: gradRate("GRTOTLT"),
      byRace: {
        unknown: gradRate("GRUNKNT"),
        multiple: gradRate("GR2MORT"),
        white: gradRate("GRWHITT"),
        hisp: gradRate("GRHISPT"),
        nathawpacisl: gradRate("GRNHPIT"),
        black: gradRate("GRBKAAT"),
        asian: gradRate("GRASIAT"),
        amerindalasknat: gradRate("GRAIANT"),
        nonresident: gradRate("GRNRALT"),
      },
    },
  };
};
