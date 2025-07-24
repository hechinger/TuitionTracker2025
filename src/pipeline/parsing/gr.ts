import { sum } from "d3-array";
import type { ParseContext } from "../utils/parseIpedsFile";

/**
 * This file separates people into "cohorts" by graduation type (`GRTYPE`),
 * and breaks down the demographic makeup of each cohort.
 */
export type RowGR = {
  GRTYPE: number; // cohort graduation type
  GRTOTLT: number; // total in the cohort
  GRUNKNT: number; // unknown race
  GR2MORT: number; // mulitple races
  GRWHITT: number; // white
  GRHISPT: number; // hispanic
  GRNHPIT: number; // native hawaiian / pacific islander
  GRBKAAT: number; // black
  GRASIAT: number; // asian
  GRAIANT: number; // american indian / alaskan native
  GRNRALT: number; // nonresident
};

export const parseGR = (
  years: RowGR[][],
  { registerError }: ParseContext,
) => {
  const rows = years.flat();

  // The cohorts that completed their degree
  const numeratorRows = rows.filter((row) => ["9", "30"].includes(`${row.GRTYPE}`));

  // The complete, super-set cohorts
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
