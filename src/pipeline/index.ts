import { performance } from "node:perf_hooks";
import { isNotUndefined } from "@/utils/isNotUndefined";
import { loadSchools } from "./utils/loadSchools";
import { getNationalAverages } from "./utils/getNationalAverages";
import { loadNationalAverages } from "./utils/loadNationalAverages";
import { parseIpedsFile } from "./utils/parseIpedsFile";
import { parseHD } from "./parsing/hd";
import { parseADM } from "./parsing/adm";
import { parseEFFY } from "./parsing/effy";
import { parseGR } from "./parsing/gr";
import { parseEFD } from "./parsing/efd";
import { parseICAY } from "./parsing/icay";
import { parseSFA } from "./parsing/sfa";
import { synthesize } from "./parsing/synthesize";

/**
  * This function runs the data pipeline for a specific year. It pulls bulk
  * data from IPEDS ([1][]), parses it, performs the necessary analysis, and
  * loads it into the database. The separate parsers here are named for the
  * IPEDS bulk files that they parse.
  *
  * [1]: https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx?gotoReportId=7&fromIpeds=true&sid=f4816230-1dce-424f-9fef-73d4260c6c68&rtid=7
  */
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

  console.log("Fetching and parsing data files...");
  performance.mark("fetch-start");
  const [
    hd, // institutional characteristics
    adm, // admissions
    gr, // graduation rates
    effy, // 12-month enrollment
    efd, // fall enrollment
    icay, // sticker price
    sfa, // net price
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
      file: "GR{YEAR}",
      years: 5,
      parseSchoolRows: parseGR,
    }, parsingContext),
    parseIpedsFile({
      file: "EFFY{YEAR}",
      parseSchoolRows: parseEFFY,
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
  performance.mark("fetch-end");

  console.log("Synthesizing schools...");
  performance.mark("synthesize-start");
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
  performance.mark("synthesize-end");

  console.log("Loading schools...");
  performance.mark("load-start");
  await loadSchools({ schools });
  performance.mark("load-end");

  console.log("Computing and loading national averages...");
  performance.mark("national-averages-start");
  const nationalAverages = getNationalAverages(schools);
  await loadNationalAverages(nationalAverages);
  performance.mark("national-averages-end");

  console.log("Done.");

  const measure = (tag: string) => {
    return performance.measure(tag, `${tag}-start`, `${tag}-end`);
  };
  console.log(measure("fetch"));
  console.log(measure("synthesize"));
  console.log(measure("load"));
};
