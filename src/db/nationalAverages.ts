import type { NationalAverages } from "@/types";
import { queryRows } from "./pool";

export type NationalAverageRow = {
  school_control: string;
  average_key: string;
  value: number;
};

export const getNationalAverages = async () => {
  const avgs = await queryRows<NationalAverageRow>(`
    SELECT school_control, average_key, value
    FROM national_averages;
  `);

  const avgEntries = {
    "2-year": [],
    "4-year": [],
  } as Record<string, (string | number)[][]>;

  avgs.forEach((avg) => {
    avgEntries[avg.school_control].push([avg.average_key, avg.value]);
  });

  return {
    "2-year": Object.fromEntries(avgEntries["2-year"]),
    "4-year": Object.fromEntries(avgEntries["4-year"]),
  } as NationalAverages;
};
