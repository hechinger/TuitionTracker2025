import { isNotUndefined } from "@/utils/isNotUndefined";
import { loadSchools } from "./utils/loadSchools";
import { parseIpedsFile } from "./utils/parseIpedsFile";
import { parseHD } from "./parsing/hd";
import { parseADM } from "./parsing/adm";
import { parseEFFY } from "./parsing/effy";
import { parseGR } from "./parsing/gr";
import { parseEFD } from "./parsing/efd";
import { parseICAY } from "./parsing/icay";
import { parseSFA } from "./parsing/sfa";
import { synthesize } from "./parsing/synthesize";

export const pipeline = async ({
  year,
}: {
  year: number;
}) => {
  const errors = [] as unknown[];
  const registerError = (err: unknown) => {
    errors.push(err);
  };

  const parsingContext = {
    year,
    baseUrl: "https://nces.ed.gov/ipeds/datacenter/data/",
    registerError,
  };

  const [
    hd,
    adm,
    effy,
    gr,
    efd,
    icay,
    sfa,
  ] = await Promise.all([
    parseIpedsFile({
      file: "HD{YEAR}",
      parseSchoolRows: parseHD,
    }, parsingContext),
    parseIpedsFile({
      file: "ADM{YEAR}",
      parseSchoolRows: parseADM,
    }, parsingContext),
    parseIpedsFile({
      file: "EFFY{YEAR}",
      parseSchoolRows: parseEFFY,
    }, parsingContext),
    parseIpedsFile({
      file: "GR{YEAR}",
      years: 5,
      parseSchoolRows: parseGR,
    }, parsingContext),
    parseIpedsFile({
      file: "EF{YEAR}D",
      years: 5,
      parseSchoolRows: parseEFD,
    }, parsingContext),
    parseIpedsFile({
      file: "IC{YEAR}_AY",
      years: 11,
      parseSchoolRows: parseICAY,
    }, parsingContext),
    parseIpedsFile({
      file: "SFA{ACADEMIC_YEAR}",
      years: 11,
      parseSchoolRows: parseSFA,
    }, parsingContext),
  ]);

  const schools = [...hd.keys()].map((id) => {
    const school = {
      ...hd.get(id)!,
      ...adm.get(id)!,
      ...effy.get(id)!,
      ...gr.get(id)!,
      ...efd.get(id)!,
      ...icay.get(id)!,
      ...sfa.get(id)!,
    };
    const synthSchool = synthesize(school, { year });
    return synthSchool || undefined;
  }).filter(isNotUndefined);

  await loadSchools({ schools });
};
