import kebabCase from "lodash/kebabCase";
import type { ParseContext } from "../utils/parseIpedsFile";

export type RowHD = {
  UNITID: number; // ID of the school in IPEDS
  INSTNM: string; // name
  IALIAS: string; // alias (for searching)
  CITY: string; // city
  STABBR: string; // state
  ZIP: number; // zip code
  LONGITUD: number; // longitude
  LATITUDE: number; // latitude
  HBCU: number; // whether this is an HBCU
  TRIBAL: number; // whether this is a tribal college
  SECTOR: number; // combination of control and level
  CONTROL: number; // public, private, for-profit
  ICLEVEL: number; // 2-year, 4-year
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
