import AdmZip from "adm-zip";

export const fetchAndUnzipIpeds = async ({
  file,
  baseUrl,
}: {
  file: string;
  baseUrl: string;
}) => {
  try {
    const zipUrl = new URL(file, baseUrl);

    const rsp = await fetch(zipUrl);
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
