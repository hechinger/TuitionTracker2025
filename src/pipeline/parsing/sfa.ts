import type { ParseContext } from "../utils/parseIpedsFile";

export type RowSFA = {
  UAGRNTP: number;
  NPIST2: number;
  NPGRN2: number;
  NPIS412: number;
  NPT412: number;
  NPIS422: number;
  NPT422: number;
  NPIS432: number;
  NPT432: number;
  NPIS442: number;
  NPT442: number;
  NPIS452: number;
  NPT452: number;
};

export const parseSFA = (
  years: RowSFA[][],
  { year: baseYear }: ParseContext,
) => {
  const [[mostRecentYear]] = years;
  const percentSticker = (100 - mostRecentYear.UAGRNTP) / 100;

  const getNetPriceYear = (year: RowSFA, yearNumber: number) => {
    return {
      year: yearNumber,
      prices: {
        average: year.NPIST2 || year.NPGRN2,
        "0_30000": year.NPIS412 || year.NPT412,
        "30001_48000": year.NPIS422 || year.NPT422,
        "48001_75000": year.NPIS432 || year.NPT432,
        "75001_110000": year.NPIS442 || year.NPT442,
        "110001": year.NPIS452 || year.NPT452,
      },
    };
  };

  return {
    percentSticker,
    netPriceYears: years.map(([year], i) => getNetPriceYear(year, baseYear - 1 - i)),
  };
};
