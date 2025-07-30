import { run } from "@/db/pool";

export const loadNationalAverages = async (nationalAverages: Record<string, Record<string, number>>) => {
  await run("TRUNCATE TABLE national_averages;");
  const rows = Object.entries(nationalAverages).map(([control, avgs]) => {
    return Object.entries(avgs).map(([key, value]) => ({
      schoolControl: control,
      averageKey: key,
      value,
    }));
  }).flat();
  const valueIds = rows.map((_, i) => {
    const x = i * 3;
    return `($${x + 1}, $${x + 2}, $${x + 3})`;
  }).join(", ");
  await run({
    text: `
      INSERT INTO national_averages
        (school_control, average_key, value)
      VALUES ${valueIds};
    `,
    values: rows.map((r) => [r.schoolControl, r.averageKey, r.value]).flat(),
  });
};
