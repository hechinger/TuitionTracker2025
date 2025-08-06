import set from "lodash/set";
import { blobCache } from "@/cache";
import { queryRows, run } from "./pool";
import { getValueIdSet } from "./getValueIdSet";

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

  const key = `content-locale-${locale || "default"}`;
  return blobCache(key, async () => {
    const query = getQuery(locale);
    const contentEntries = await queryRows<Row>(query);

    const contentByLocale = {
      en: {},
      es: {},
    } as Record<string, Record<string, string>>;
    contentEntries.forEach((row) => {
      const l = row.locale;
      if (!l || l === "en") {
        set(contentByLocale.en, [`${row.component}.${row.path}`], row.value);
      }
      if (!l || l === "es") {
        set(contentByLocale.es, [`${row.component}.${row.path}`], row.value);
      }
    });

    return contentByLocale;
  });
};

export const getContentForAdmin = async () => {
  const contentEntries = await queryRows<ContentRow>(
    "SELECT db_id, locale, component, path, value FROM content;",
  );

  return contentEntries;
};

export const setContent = async (rows: ContentRow[]) => {
  const updates = [] as ContentRow[];
  const creations = [] as ContentRow[];
  rows.forEach((row) => {
    const method = row.db_id ? updates : creations;
    method.push(row);
  });

  if (creations.length > 0) {
    const creationValueIds = getValueIdSet({
      rows: creations,
      columns: ["locale", "component", "path", "value"],
    });
    const creationValues = creations.map((row) => [
      row.locale,
      row.component,
      row.path,
      row.value,
    ]).flat();
    const creationQuery = {
      text: `
        INSERT INTO content
          (locale, component, path, value)
        VALUES ${creationValueIds};
      `,
      values: creationValues,
    };
    await run(creationQuery);
  }

  if (updates.length > 0) {
    const updateValueIds = getValueIdSet({
      rows: updates,
      columns: ["db_id", "locale", "component", "path", "value"],
    });
    const updateValues = updates.map((row) => [
      row.db_id,
      row.locale,
      row.component,
      row.path,
      row.value,
    ]).flat();
    const updateQuery = {
      text: `
        INSERT INTO content
          (db_id, locale, component, path, value)
        VALUES ${updateValueIds}
        ON CONFLICT (db_id) DO UPDATE
        SET
          locale = EXCLUDED.locale,
          component = EXCLUDED.component,
          path = EXCLUDED.path,
          value = EXCLUDED.value;
      `,
      values: updateValues,
    };
    await run(updateQuery);
  }
};
