import { resolveFileTemplate } from "./resolveFileTemplate";
import { fetchAndUnzipIpeds } from "./fetchAndUnzipIpeds";
import { parseCsv } from "./parseCsv";

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
