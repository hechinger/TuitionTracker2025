import groupBy from "lodash/groupBy";
import { fetchIpedsFile } from "./fetchIpedsFile";

export type RegisteredError = {
  schoolId: string;
  file: string;
  error: unknown;
};

export type ParseContext = {
  schoolId: string;
  year: number;
  registerError: (error: string) => void;
};

export type IpedsFullFileConfig<FileRow = unknown> = {
  file: string;
  year: number;
  baseUrl: string;
  parseSchoolRows: (years: FileRow[][], context: ParseContext) => Record<string, unknown>;
  years?: number;
  schoolIdKey?: string;
};

export type IpedsFileConfig<FileRow = unknown> = Pick<
  IpedsFullFileConfig<FileRow>,
  "file" | "years" | "schoolIdKey" | "parseSchoolRows"
>;

export const parseIpedsFile = async <FileRow, SchoolDataSegment>(
  config: {
    file: string;
    years?: number;
    schoolIdKey?: string;
    parseSchoolRows: (years: FileRow[][], context: ParseContext) => SchoolDataSegment;
  },
  context: {
    baseUrl: string;
    year: number;
    registerError: (error: RegisteredError) => void;
  },
) => {
  const {
    file,
    parseSchoolRows,
    schoolIdKey = "UNITID",
    years = 1,
  } = config;

  const {
    year,
    baseUrl,
    registerError = () => {},
  } = context;

  const schoolYears = new Map<string, FileRow[][]>();

  await [...Array(years)].reduce(async (promise, _, i) => {
    await promise;

    const data = await fetchIpedsFile<FileRow>({
      fileTemplate: file,
      year: year - i,
      baseUrl,
    });
    const grouped = groupBy(data.data.data, schoolIdKey);

    Object.entries(grouped).forEach(([schoolId, rows]) => {
      const schoolYearRows = schoolYears.get(schoolId) || [];
      schoolYearRows.push(rows);
      schoolYears.set(schoolId, schoolYearRows);
    });
  }, Promise.resolve());

  const parsed = new Map([...schoolYears].map(([schoolId, data]) => {
    const parsedData = parseSchoolRows(data, {
      schoolId,
      year,
      registerError: (error) => registerError({
        schoolId,
        file,
        error,
      }),
    });
    return [schoolId, parsedData];
  }));

  return parsed;
};
