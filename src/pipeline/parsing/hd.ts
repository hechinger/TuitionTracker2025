import kebabCase from "lodash/kebabCase";
import type { ParseContext } from "../utils/parseIpedsFile";

export type RowHD = {
  UNITID: number;
  INSTNM: string;
  IALIAS: string;
  CITY: string;
  STABBR: string;
  ZIP: number;
  LONGITUD: number;
  LATITUDE: number;
  HBCU: number;
  TRIBAL: number;
  SECTOR: number;
  CONTROL: number;
  ICLEVEL: number;
};

export const parseHD = (
  years: RowHD[][],
  { registerError }: ParseContext,
) => {
  const [[data]] = years;
  const id = `${data.UNITID}`;
  const schoolData = {
    id,
    slug: `${kebabCase(data.INSTNM)}-${id}`,
    image: null,
    name: data.INSTNM,
    alias: data.IALIAS,
    city: data.CITY,
    state: data.STABBR,
    zip: `${data.ZIP}`,
    longitude: `${data.LONGITUD}`,
    latitude: `${data.LATITUDE}`,
    hbcu: `${data.HBCU}` === "1",
    tribalCollege: `${data.TRIBAL}` === "1",
    sector: `${data.SECTOR}`,
    schoolControl: (() => {
      const control = `${data.CONTROL}`;
      if (control === "1") return "public";
      if (control === "2") return "private";
      if (control === "3") return "for-profit";
      registerError(`Unhandled school control value: ${control}`);
      return null;
    })(),
    degreeLevel: (() => {
      const level = `${data.ICLEVEL}`;
      if (level === "1") return "4-year";
      if (level === "2") return "2-year";
      if (level === "3") return "2-year";
      registerError(`Unhandled degree level value: ${level}`);
      return null;
    })(),
  };
  return schoolData;
};
