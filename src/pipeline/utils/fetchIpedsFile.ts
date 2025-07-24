import { resolveFileTemplate } from "./resolveFileTemplate";
import { fetchAndUnzipIpeds } from "./fetchAndUnzipIpeds";
import { parseCsv } from "./parseCsv";

/**
 * This will interpolate the templated file name of an IPEDS file and then
 * download and unzip the correct file. This is necessary because the file
 * names themselves include the year, so in order to download a bulk data
 * file for a particular year, we have to inject the year into the name of
 * the file in an inconsistent way.
 */
export const fetchIpedsFile = async <FileRow = unknown>({
  fileTemplate,
  year,
  baseUrl,
}: {
  fileTemplate: string;
  year: number;
  baseUrl: string;
}) => {
  const {
    fileType,
    fileId,
  } = resolveFileTemplate({ template: fileTemplate, year });

  const [
    dataFile,
  ] = await Promise.all([
    fetchAndUnzipIpeds({
      file: `${fileType}.zip`,
      baseUrl,
    }),
  ]);

  const data = await parseCsv<FileRow>(dataFile);

  return {
    fileId,
    fileType,
    data,
  };
};
