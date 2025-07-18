import { Pool, type QueryResultRow } from "pg";
import sqlite3 from "sqlite3";

const dbUrl = process.env.DATABASE_URL;

const getDbType = () => {
  if (!dbUrl) {
    throw new Error("Must specify DATABASE_URL in .env file");
  }

  if (dbUrl.startsWith("postgres")) {
    return { type: "postgres", url: dbUrl };
  }

  if (dbUrl.startsWith("sqlite")) {
    return { type: "sqlite", url: dbUrl };
  }

  throw new Error(`Unsupported DATABASE_URL type: ${dbUrl}`);
};

const db = getDbType();

const pool = db.type === "postgres" && new Pool({
  connectionString: db.url,
});

const local = db.type === "sqlite" && new sqlite3.Database(
  db.url.slice("sqlite://".length),
);

type QueryConfig = {
  text: string;
  values: unknown[];
};

export const queryRows = async <T extends QueryResultRow>(query: string | QueryConfig) => {
  const db = getDbType();

  if (db.type === "postgres") {
    if (!pool) throw new Error("Unconfigured database");
    const rsp = await pool.query<T>(query);
    return rsp.rows;
  }

  if (db.type === "sqlite") {
    if (!local) throw new Error("Unconfigured database");
    const rows = await new Promise((resolve, reject) => {
      const q = (typeof query === "string")
        ? { text: query, values: [] }
        : query;
      const { text, values } = q;
      const valueObject = Object.fromEntries(values.map((v, i) => [
        `$${i + 1}`,
        v,
      ]));
      local.all<T>(text, valueObject, function(error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve({
            rows,
          });
        }
      });
    });
    return rows as T[];
  }

  throw new Error("Unconfigured database");
};

export const run = async (query: string | QueryConfig) => {
  const db = getDbType();

  if (db.type === "postgres") {
    if (!pool) throw new Error("Unconfigured database");
    await pool.query(query);
  }

  if (db.type === "sqlite") {
    if (!local) throw new Error("Unconfigured database");
    const rows = await new Promise((resolve, reject) => {
      const q = (typeof query === "string")
        ? { text: query, values: [] }
        : query;
      const { text, values } = q;
      const valueObject = Object.fromEntries(values.map((v, i) => [
        `$${i + 1}`,
        v,
      ]));
      local.run(text, valueObject, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve({
            rows,
          });
        }
      });
    });
  }

  throw new Error("Unconfigured database");
};
