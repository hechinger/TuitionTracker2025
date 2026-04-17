import { run } from "@/db/pool";

export const loadNationalAverages = async (nationalAverages: Record<string, Record<string, number>>) => {
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

  // Wrap in a transaction so that if the INSERT fails, the
  // TRUNCATE is rolled back and existing data is preserved.
  await run("BEGIN;");
  try {
    await run("TRUNCATE TABLE national_averages;");
    await run({
      text: `
        INSERT INTO national_averages
          (school_control, average_key, value)
        VALUES ${valueIds};
      `,
      values: rows.map((r) => [r.schoolControl, r.averageKey, r.value]).flat(),
    });
    await run("COMMIT;");
  } catch (error) {
    await run("ROLLBACK;");
    throw error;
  }
};
