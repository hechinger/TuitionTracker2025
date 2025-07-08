import set from "lodash/set";
import { pool } from "./pool";

export type ContentRow = {
  db_id: number;
  locale: string | null;
  component: string;
  path: string;
  value: string | null;
};

type Row = Omit<ContentRow, "db_id">;

const getQuery = (locale?: string) => {
  if (!locale) {
    return "SELECT locale, component, path, value FROM content;";
  }

  return {
    text: `
      SELECT locale, component, path, value
      FROM content
      WHERE locale = $1 OR locale IS NULL;
    `,
    values: [locale],
  };
};

export const getContent = async (opts: {
  locale?: string;
} = {}) => {
  const {
    locale,
  } = opts;

  const query = getQuery(locale);
  const contentEntries = await pool.query<Row>(query);

  const contentByLocale = {
    en: {},
    es: {},
  } as Record<string, Record<string, string>>;
  contentEntries.rows.forEach((row) => {
    const l = row.locale;
    if (!l || l === "en") {
      set(contentByLocale.en, [`${row.component}.${row.path}`], row.value);
    }
    if (!l || l === "es") {
      set(contentByLocale.es, [`${row.component}.${row.path}`], row.value);
    }
  });

  return contentByLocale;
};

export const getContentForAdmin = async () => {
  const contentEntries = await pool.query<ContentRow>(
    "SELECT db_id, locale, component, path, value FROM content;",
  );

  return contentEntries.rows;
};

export const setContent = async (rows: ContentRow[]) => {
  for (const row of rows) {
    if (row.db_id) {
      await pool.query({
        text: `
          UPDATE content
          SET locale = $1,
              component = $2,
              path = $3,
              value = $4
          WHERE db_id = $5;
        `,
        values: [row.locale, row.component, row.path, row.value, row.db_id],
      });
    } else {
      await pool.query({
        text: `
          INSERT INTO content (locale, component, path, value)
          VALUES ($1, $2, $3, $4);
        `,
        values: [row.locale, row.component, row.path, row.value],
      });
    }
  }
};
