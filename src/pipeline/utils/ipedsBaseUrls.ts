/**
 * IPEDS serves its bulk zips from two directories, and neither one holds
 * the whole archive. Newer collection years are published under
 * `complete-data-files`, while older years stay behind at the legacy
 * `datacenter/data` path. For a single pipeline year we need files from
 * both — a 2024 run, for example, takes its current-year files from the
 * new path and its ten years of back-files from the old one — so every
 * download tries these in order and uses the first that resolves.
 */
export const IPEDS_BASE_URLS = [
  "https://nces.ed.gov/ipeds/complete-data-files/",
  "https://nces.ed.gov/ipeds/datacenter/data/",
];
