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
import { parseSFA, type RowSFA } from "./parsing/sfa";
import { synthesize } from "./parsing/synthesize";

/**
 * Starting with 2024, IPEDS reorganised sticker price and net price data
 * into new COST1 / COST2 files (the column names are unchanged). For older
 * years the legacy IC_AY and SFA files are still used.
 */
const COST_TRANSITION_YEAR = 2024;

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

  console.log(`Starting data pipeline for year ${year}...`);
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
      file: year >= COST_TRANSITION_YEAR
        ? (y: number) => y >= COST_TRANSITION_YEAR ? "COST1_{YEAR}" : "IC{YEAR}_AY"
        : "IC{YEAR}_AY",
      years: 11,
      parseSchoolRows: parseICAY,
    }, parsingContext),
    parseIpedsFile({
      file: year >= COST_TRANSITION_YEAR
        ? (y: number) => y >= COST_TRANSITION_YEAR ? "COST2_{YEAR}" : "SFA{ACADEMIC_YEAR}"
        : "SFA{ACADEMIC_YEAR}",
      years: 11,
      parseSchoolRows: parseSFA,
    }, parsingContext),
  ]);
  performance.mark("fetch-end");
  console.log(`  HD: ${hd.size} schools, ADM: ${adm.size}, GR: ${gr.size}, EFFY: ${effy.size}, EFD: ${efd.size}`);
  console.log(`  Sticker price: ${icay.size} schools, Net price: ${sfa.size} schools`);

  // For 2024+, UAGRNTP (percent paying sticker price) is still in SFA but
  // net price data moved to COST2. Fetch the current year's SFA separately
  // to patch percentSticker into the COST2-based results.
  if (year >= COST_TRANSITION_YEAR) {
    const sfaForUagrntp = await parseIpedsFile<RowSFA, { percentSticker: number }>({
      file: "SFA{ACADEMIC_YEAR}",
      years: 1,
      parseSchoolRows: (years) => {
        const [[row]] = years;
        return { percentSticker: (100 - (row.UAGRNTP ?? 0)) / 100 };
      },
    }, parsingContext);

    for (const [id, { percentSticker }] of sfaForUagrntp) {
      const sfaData = sfa.get(id);
      if (sfaData) {
        sfaData.percentSticker = percentSticker;
      }
    }
  }

  console.log(`Synthesizing ${hd.size} schools...`);
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
  console.log(`Synthesized ${schools.length} schools (${hd.size - schools.length} filtered out)`);

  console.log(`Loading ${schools.length} schools into database...`);
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
  const fmt = (tag: string) => {
    const m = measure(tag);
    return `${tag}: ${(m.duration / 1000).toFixed(1)}s`;
  };
  console.log(`Timing — ${fmt("fetch")}, ${fmt("synthesize")}, ${fmt("load")}, ${fmt("national-averages")}`);
  if (errors.length > 0) {
    const counts = new Map<string, number>();
    for (const e of errors) {
      const msg = typeof e === "object" && e !== null && "error" in e ? `${(e as { error: unknown }).error}` : `${e}`;
      counts.set(msg, (counts.get(msg) ?? 0) + 1);
    }
    console.warn(`Pipeline completed with ${errors.length} warning(s):`);
    for (const [msg, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
      console.warn(`  ${count}× ${msg}`);
    }
  }
};
