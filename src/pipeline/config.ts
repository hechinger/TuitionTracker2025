import type { IpedsDatasetConfig } from "./utils/parseIpedsDataset";
import { parseHD } from "./parsing/hd";
import { parseADM } from "./parsing/adm";
import { parseEFFY } from "./parsing/effy";
import { parseGR } from "./parsing/gr";
import { parseEFD } from "./parsing/efd";
import { parseICAY } from "./parsing/icay";
import { parseSFA } from "./parsing/sfa";
import { synthesize } from "./parsing/synthesize";

export const getConfig = (baseYear: number): IpedsDatasetConfig => ({
  year: baseYear,
  baseUrl: "https://nces.ed.gov/ipeds/datacenter/data/",
  files: [
    {
      file: "HD{YEAR}",
      parseSchoolRows: parseHD,
    },
    {
      file: "ADM{YEAR}",
      parseSchoolRows: parseADM,
    },
    {
      file: "EFFY{YEAR}",
      parseSchoolRows: parseEFFY,
    },
    {
      file: "GR{YEAR}",
      years: 5,
      parseSchoolRows: parseGR,
    },
    {
      file: "EF{YEAR}D",
      years: 5,
      parseSchoolRows: parseEFD,
    },
    {
      file: "IC{YEAR}_AY",
      years: 11,
      parseSchoolRows: parseICAY,
    },
    {
      file: "SFA{ACADEMIC_YEAR}",
      years: 11,
      parseSchoolRows: parseSFA,
    },
  ],
  synthesizeSchool: synthesize,
});
