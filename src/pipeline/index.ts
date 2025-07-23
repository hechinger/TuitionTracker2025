import { loadSchools } from "./utils/loadSchools";
import { parseIpedsDataset } from "./utils/parseIpedsDataset";
import { getConfig } from "./config";

export const pipeline = async ({
  year,
}: {
  year: number;
}) => {
  const config = getConfig(year);
  const dataset = await parseIpedsDataset(config);
  const schools = Object.values(dataset.dataset);
  await loadSchools(schools);
};
