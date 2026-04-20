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
  file: string | ((year: number) => string);
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

/**
 * Dowload and parse an IPEDS bulk data file for a particular year. This
 * supports downloading multiple years worth of the same bulk file.
 */
export const parseIpedsFile = async <FileRow, SchoolDataSegment>(
  config: {
    file: string | ((year: number) => string);
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

  // We organize data by school ID. Each school may result in multiple rows
  // depending on the bulk data file or if we're downloading multiple years.
  const schoolYears = new Map<string, FileRow[][]>();

  // Fetch and parse all the files, organizing the rows by school
  await [...Array(years)].reduce(async (promise, _, i) => {
    await promise;

    const fileTemplate = typeof file === 'function' ? file(year - i) : file;
    const data = await fetchIpedsFile<FileRow>({
      fileTemplate,
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

  // Parse the rows for each school using the provided parsing function
  const parsed = new Map([...schoolYears].map(([schoolId, data]) => {
    const parsedData = parseSchoolRows(data, {
      schoolId,
      year,
      registerError: (error) => registerError({
        schoolId,
        file: typeof file === 'function' ? file(year) : file,
        error,
      }),
    });
    return [schoolId, parsedData];
  }));

  return parsed;
};
