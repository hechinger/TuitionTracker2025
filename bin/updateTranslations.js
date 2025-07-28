require("dotenv").config();
const fs = require("node:fs");
const pg = require("pg");
const Papa = require("papaparse");

const dbUrl = process.env.DATABASE_URL;

const db = new pg.Pool({
  connectionString: dbUrl,
});

const main = async () => {
  const text = fs.readFileSync("src/data/translations.csv");
  const translations = await new Promise((resolve, reject) => {
    try {
      Papa.parse(text.toString(), {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results);
        },
      });
    } catch (error) {
      reject(error);
    }
  });

  const { rows: content } = await db.query("SELECT * FROM content WHERE locale IS NOT NULL;");
  const keyToId = new Map(content.map((row) => {
    const key = `${row.component}.${row.path}.${row.locale}`;
    return [key, row.db_id];
  }));

  const rows = translations.data.map((row) => {
    const key = row.Path;
    const [component, ...pathSegments] = key.split(".");
    const path = pathSegments.join(".");
    const base = {
      component,
      path,
    };
    return [
      {
        ...base,
        key: `${key}.en`,
        value: row.English,
        locale: "en",
      },
      {
        ...base,
        key: `${key}.es`,
        value: row.Spanish,
        locale: "es",
      },
    ];
  }).flat();

  const creations = rows.filter((r) => !keyToId.has(r.key));
  const updates = rows.filter((r) => keyToId.has(r.key));

  const uValueSets = updates.map((r, i) => {
    const segs = [
      keyToId.has(r.key) ? `$${(i * 5) + 1}` : "DEFAULT",
      `$${(i * 5) + 2}`,
      `$${(i * 5) + 3}`,
      `$${(i * 5) + 4}`,
      `$${(i * 5) + 5}`,
    ];
    return `(${segs.join(", ")})`;
  });
  const uValues = updates.map((r) => [
    keyToId.get(r.key),
    r.component,
    r.path,
    r.locale,
    r.value,
  ]).flat();

  const uQuery = {
    text: `
      INSERT INTO content
        (db_id, component, path, locale, value)
      VALUES
        ${uValueSets}
      ON CONFLICT (db_id) DO UPDATE
      SET value = EXCLUDED.value;
    `,
    values: uValues,
  };

  const cValueSets = creations.map((_, i) => {
    const segs = [
      `$${(i * 4) + 1}`,
      `$${(i * 4) + 2}`,
      `$${(i * 4) + 3}`,
      `$${(i * 4) + 4}`,
    ];
    return `(${segs.join(", ")})`;
  });
  const cValues = creations.map((r) => [
    r.component,
    r.path,
    r.locale,
    r.value,
  ]).flat();

  const cQuery = {
    text: `
      INSERT INTO content
        (component, path, locale, value)
      VALUES
        ${cValueSets};
    `,
    values: cValues,
  };

  await db.query(uQuery);
  await db.query(cQuery);
};

main();
