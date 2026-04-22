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

/** Log current heap usage so we can predict Vercel OOM (2 GB limit). */
const logMemory = (label: string) => {
  const { heapUsed, rss } = process.memoryUsage();
  const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(0);
  console.log(`[pipeline] [mem] ${label}: heap ${mb(heapUsed)} MB, rss ${mb(rss)} MB`);
};

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

  console.log(`[pipeline] Starting data pipeline for year ${year}...`);
  console.log("[pipeline] Fetching and parsing data files...");
  performance.mark("fetch-start");

  // Phase 1a — single-year files can all run in parallel.
  const [
    hd, // institutional characteristics
    adm, // admissions
    effy, // 12-month enrollment
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
  ]);
  logMemory("after phase 1a (single-year files)");

  // Phase 1b — 5-year files fetched sequentially with column pruning.
  const gr = await parseIpedsFile({
    file: "GR{YEAR}",
    years: 5,
    columns: ["GRTYPE", "GRTOTLT", "GRUNKNT", "GR2MORT", "GRWHITT", "GRHISPT", "GRNHPIT", "GRBKAAT", "GRASIAT", "GRAIANT", "GRNRALT"],
    parseSchoolRows: parseGR,
  }, parsingContext);

  const efd = await parseIpedsFile({
    file: "EF{YEAR}D",
    years: 5,
    columns: ["RET_NMF", "RRFTCTA", "RET_NMP", "RRPTCTA"],
    parseSchoolRows: parseEFD,
  }, parsingContext);
  logMemory("after phase 1b (5-year files)");

  // Phase 2 — large 11-year files fetched sequentially to avoid OOM on
  // Vercel (each accumulates ~7k schools × 11 years of raw CSV rows).
  // The `columns` lists prune unused CSV columns (100+) immediately after
  // parsing so only the ~10 needed fields per row stay in memory.
  const icay = await parseIpedsFile({
    file: year >= COST_TRANSITION_YEAR
      ? (y: number) => y >= COST_TRANSITION_YEAR ? "COST1_{YEAR}" : "IC{YEAR}_AY"
      : "IC{YEAR}_AY",
    years: 11,
    columns: ["CHG2AY3", "CHG3AY3", "CHG4AY3", "CHG5AY3", "CHG6AY3", "CHG7AY3", "CHG8AY3"],
    parseSchoolRows: parseICAY,
  }, parsingContext);
  logMemory("after sticker price (11 years)");

  const sfa = await parseIpedsFile({
    file: year >= COST_TRANSITION_YEAR
      ? (y: number) => y >= COST_TRANSITION_YEAR ? "COST2_{YEAR}" : "SFA{ACADEMIC_YEAR}"
      : "SFA{ACADEMIC_YEAR}",
    years: 11,
    columns: ["UAGRNTP", "NPIST2", "NPGRN2", "NPIS412", "NPT412", "NPIS422", "NPT422", "NPIS432", "NPT432", "NPIS442", "NPT442", "NPIS452", "NPT452"],
    parseSchoolRows: parseSFA,
  }, parsingContext);
  logMemory("after net price (11 years)");

  performance.mark("fetch-end");
  console.log(`[pipeline]   HD: ${hd.size} schools, ADM: ${adm.size}, GR: ${gr.size}, EFFY: ${effy.size}, EFD: ${efd.size}`);
  console.log(`[pipeline]   Sticker price: ${icay.size} schools, Net price: ${sfa.size} schools`);

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

  console.log(`[pipeline] Synthesizing ${hd.size} schools...`);
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
  console.log(`[pipeline] Synthesized ${schools.length} schools (${hd.size - schools.length} filtered out)`);
  logMemory("after synthesize");

  console.log(`[pipeline] Loading ${schools.length} schools into database...`);
  performance.mark("load-start");
  await loadSchools({ schools });
  performance.mark("load-end");

  console.log("[pipeline] Computing and loading national averages...");
  performance.mark("national-averages-start");
  const nationalAverages = getNationalAverages(schools);
  await loadNationalAverages(nationalAverages);
  performance.mark("national-averages-end");

  console.log("[pipeline] Done.");

  const measure = (tag: string) => {
    return performance.measure(tag, `${tag}-start`, `${tag}-end`);
  };
  const fmt = (tag: string) => {
    const m = measure(tag);
    return `${tag}: ${(m.duration / 1000).toFixed(1)}s`;
  };
  console.log(`[pipeline] Timing — ${fmt("fetch")}, ${fmt("synthesize")}, ${fmt("load")}, ${fmt("national-averages")}`);
  if (errors.length > 0) {
    const counts = new Map<string, number>();
    for (const e of errors) {
      const msg = typeof e === "object" && e !== null && "error" in e ? `${(e as { error: unknown }).error}` : `${e}`;
      counts.set(msg, (counts.get(msg) ?? 0) + 1);
    }
    console.warn(`[pipeline] Pipeline completed with ${errors.length} warning(s):`);
    for (const [msg, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
      console.warn(`[pipeline]   ${count}× ${msg}`);
    }
  }
};
