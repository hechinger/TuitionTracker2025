import { resolveFileTemplate } from "./resolveFileTemplate";

/**
 * Starting with 2024, IPEDS reorganised sticker price and net price data
 * into new COST1 / COST2 files. For older years the legacy IC_AY and SFA
 * files are still used. The column names are unchanged.
 */
const COST_TRANSITION_YEAR = 2024;

/**
 * Get all resolved zip file names that the pipeline needs for a given year.
 * For years >= 2024 this accounts for the IC_AY → COST1 and SFA → COST2
 * transition, and includes the extra SFA fetch needed for UAGRNTP.
 */
export const getIpedsFilesForYear = (year: number) => {
  const files: { file: string; label: string }[] = [];

  // Standard templates (unchanged across the transition)
  const standardTemplates = [
    { template: "HD{YEAR}", years: 1, label: "Institutional Characteristics" },
    { template: "ADM{YEAR}", years: 1, label: "Admissions" },
    { template: "GR{YEAR}", years: 5, label: "Graduation Rates" },
    { template: "EFFY{YEAR}", years: 1, label: "Enrollment" },
    { template: "EF{YEAR}D", years: 5, label: "Fall Enrollment" },
  ];

  for (const { template, years, label } of standardTemplates) {
    for (let i = 0; i < years; i++) {
      const { fileType } = resolveFileTemplate({ template, year: year - i });
      files.push({ file: `${fileType}.zip`, label });
    }
  }

  // Sticker price: COST1 for years >= 2024, IC_AY for older
  for (let i = 0; i < 11; i++) {
    const y = year - i;
    const template = y >= COST_TRANSITION_YEAR ? "COST1_{YEAR}" : "IC{YEAR}_AY";
    const { fileType } = resolveFileTemplate({ template, year: y });
    files.push({ file: `${fileType}.zip`, label: "Sticker Price" });
  }

  // Net price: COST2 for years >= 2024, SFA for older
  for (let i = 0; i < 11; i++) {
    const y = year - i;
    const template = y >= COST_TRANSITION_YEAR ? "COST2_{YEAR}" : "SFA{ACADEMIC_YEAR}";
    const { fileType } = resolveFileTemplate({ template, year: y });
    files.push({ file: `${fileType}.zip`, label: "Net Price" });
  }

  // For 2024+, also need SFA for the current year to get UAGRNTP
  if (year >= COST_TRANSITION_YEAR) {
    const { fileType } = resolveFileTemplate({ template: "SFA{ACADEMIC_YEAR}", year });
    files.push({ file: `${fileType}.zip`, label: "Net Price (% Sticker)" });
  }

  return files;
};
