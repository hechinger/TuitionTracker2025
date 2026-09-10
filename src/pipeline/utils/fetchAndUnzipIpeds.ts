import AdmZip from "adm-zip";
import { fetchWithRetries } from "./fetchWithRetries";

/**
 * Download and unzip a bulk data file from IPEDS. Note that the zip files
 * can contain multiple entries when the data has been revised. We prefer
 * the revised data by looking for entries that end in the suffix `_rv`. If
 * the data hasn't been revised, we just use what we get.
 *
 * IPEDS splits its archive across more than one directory, so we try each
 * base URL in turn and use the first one that has the file.
 */
export const fetchAndUnzipIpeds = async ({
  file,
  baseUrls,
}: {
  file: string;
  baseUrls: string[];
}) => {
  try {
    const zipBuffer = await (async () => {
      for (const baseUrl of baseUrls) {
        const zipUrl = new URL(file, baseUrl).href;
        try {
          const rsp = await fetchWithRetries(zipUrl, 1);
          console.log(`[pipeline]   Downloaded ${file} from ${baseUrl}`);
          return Buffer.from(await rsp.arrayBuffer());
        } catch {
          // Try the next base URL
        }
      }
      throw new Error(`File not available at any IPEDS base URL: ${file}`);
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
