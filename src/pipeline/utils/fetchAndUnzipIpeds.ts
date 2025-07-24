import AdmZip from "adm-zip";
import { fetchWithRetries } from "./fetchWithRetries";

/**
 * Download and unzip a bulk data file from IPEDS. Note that the zip files
 * can contain multiple entries when the data has been revised. We prefer
 * the revised data by looking for entries that end in the suffix `_rv`. If
 * the data hasn't been revised, we just use what we get.
 */
export const fetchAndUnzipIpeds = async ({
  file,
  baseUrl,
}: {
  file: string;
  baseUrl: string;
}) => {
  try {
    const zipUrl = new URL(file, baseUrl).href;

    const rsp = await fetchWithRetries(zipUrl);
    const body = await rsp.arrayBuffer();
    const zip = new AdmZip(Buffer.from(body));
    const [unzippedFile] = zip.getEntries()
      .sort((a, b) => {
        const aVal = a.name.includes("_rv") ? 1 : 0;
        const bVal = b.name.includes("_rv") ? 1 : 0;
        return bVal - aVal;
      });

    const content = zip.readAsText(unzippedFile);
    return content;
  } catch (error) {
    console.error(`Failed to download and unzip file: ${file}`);
    console.error(error);
    throw error;
  }
};
