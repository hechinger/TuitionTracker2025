import chunk from "lodash/chunk";
import { loadSchoolTable } from "./loadSchoolTable";
import { loadPriceTable } from "./loadPriceTable";

export const loadSchools = async <School = Record<string, unknown>>({
  schools,
  chunkSize = 100,
}: {
  schools: School[],
  chunkSize?: number;
}) => {
  const schoolChunks = chunk(schools, chunkSize);
  await schoolChunks.reduce(async (promise, ss) => {
    await promise;

    // Update schools table
    await loadSchoolTable(ss);

    // Update prices table
    await loadPriceTable(ss);
  }, Promise.resolve());
};
