import { isNotUndefined } from "@/utils/isNotUndefined";
import { parseIpedsFile, type IpedsFileConfig } from "./parseIpedsFile";

export type IpedsDatasetConfig = {
  year: number;
  baseUrl: string;
  files: {
    file: string;
    years?: number;
    schoolIdKey?: string;
    parseSchoolRows: IpedsFileConfig["parseSchoolRows"];
  }[];
  synthesizeSchool: (school: Record<string, unknown>) => Record<string, unknown> | null;
};

export const parseIpedsDataset = async (config: IpedsDatasetConfig) => {
  const errors = [] as unknown[];
  const registerError = (err: unknown) => {
    errors.push(err);
  };

  const dataset = await config.files.reduce(async (promise, fileConfig) => {
    const partialDataset = await promise;

    const cfg = {
      file: fileConfig.file,
      year: config.year,
      baseUrl: config.baseUrl,
      parseSchoolRows: fileConfig.parseSchoolRows,
      schoolIdKey: fileConfig.schoolIdKey,
      years: fileConfig.years,
    };
    const fileSchools = await parseIpedsFile(cfg, {
      year: config.year,
      registerError,
    });

    [...fileSchools].forEach(([schoolId, schoolData]) => {
      const partialSchoolData = partialDataset.get(schoolId) || {};
      partialDataset.set(schoolId, { ...partialSchoolData, ...schoolData });
    });

    return partialDataset;
  }, Promise.resolve(new Map<string, Record<string, unknown>>()));

  const entries = [...dataset]
    .map(([id, school]) => {
      const synthSchool = config.synthesizeSchool(school, { year: baseYear });
      if (!synthSchool) return undefined;
      return [id, synthSchool];
    })
    .filter(isNotUndefined);

  return {
    dataset: Object.fromEntries(entries),
    errors,
  };
};
