import AdmZip from "adm-zip";
import { fetchWithRetries } from "./fetchWithRetries";

/**
 * Generate a .NET ticks timestamp for use with the IPEDS data generator API.
 */
const getNetTicks = () => {
  return Math.floor((Date.now() / 1000 + 62135596800) * 10000000);
};

/**
 * Download and unzip a bulk data file from IPEDS. Note that the zip files
 * can contain multiple entries when the data has been revised. We prefer
 * the revised data by looking for entries that end in the suffix `_rv`. If
 * the data hasn't been revised, we just use what we get.
 *
 * If the file is not available at the static URL, we fall back to the IPEDS
 * data generator API, which has some files not yet on the static directory.
 */
export const fetchAndUnzipIpeds = async ({
  file,
  baseUrl,
  surveyYear,
}: {
  file: string;
  baseUrl: string;
  surveyYear?: number;
}) => {
  try {
    const zipBuffer = await (async () => {
      // Try the static IPEDS directory first
      const zipUrl = new URL(file, baseUrl).href;
      try {
        const rsp = await fetchWithRetries(zipUrl, 1);
        console.log(`[pipeline]   Downloaded ${file} from static URL`);
        return Buffer.from(await rsp.arrayBuffer());
      } catch {
        // Fall back to the IPEDS data generator API
        if (!surveyYear) throw new Error(`File not available: ${file}`);
        const tableName = file.replace(/\.zip$/i, "");
        const t = getNetTicks();
        const fallbackUrl = `https://nces.ed.gov/ipeds/data-generator?year=${surveyYear}&tableName=${tableName}&HasRV=0&type=csv&t=${t}`;
        console.log(`[pipeline]   Static URL not available for ${file}, trying data generator...`);
        const rsp = await fetchWithRetries(fallbackUrl);
        console.log(`[pipeline]   Downloaded ${file} from data generator`);
        return Buffer.from(await rsp.arrayBuffer());
      }
    })();

    const zip = new AdmZip(zipBuffer);
    const [unzippedFile] = zip.getEntries()
      .sort((a, b) => {
        const aVal = a.name.includes("_rv") ? 1 : 0;
        const bVal = b.name.includes("_rv") ? 1 : 0;
        return bVal - aVal;
      });

    const content = zip.readAsText(unzippedFile);
    return content;
  } catch (error) {
    console.error(`[pipeline] Failed to download and unzip file: ${file}`);
    console.error("[pipeline]", error);
    throw error;
  }
};
