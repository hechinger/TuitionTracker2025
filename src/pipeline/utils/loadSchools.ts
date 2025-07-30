import chunk from "lodash/chunk";
import { loadSchoolTable } from "./loadSchoolTable";
import { loadPriceTable } from "./loadPriceTable";

/**
 * Take the whole set of parsed school data and load it into the `schools`
 * and `prices` tables of the database.
 */
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
