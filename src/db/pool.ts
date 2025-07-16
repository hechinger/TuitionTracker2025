import { Pool } from "pg";
import sqlite3 from "sqlite3";

const dbUrl = process.env.DATABASE_URL;

const getDb = () => {
  if (!dbUrl) {
    throw new Error("Must specify DATABASE_URL in .env file");
  }

  if (dbUrl.startsWith("postgres")) {
    return new Pool({
      connectionString: dbUrl,
    });
  }

  if (dbUrl.startsWith("sqlite")) {
    const fileName = dbUrl.slice("sqlite://".length);
    const conn = new sqlite3.Database(fileName);

    const query = async <T>(opts: string | { text: string, values: unknown[] }) => {
      return new Promise((resolve, reject) => {
        const q = (typeof opts === "string") ? { text: opts, values: [] } : opts;
        const { text, values } = q;
        const valueObject = Object.fromEntries(values.map((v, i) => [
          `$${i + 1}`,
          v,
        ]));
        conn.all(text, valueObject, function(error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve({
              rows: (rows) as T[],
            });
          }
        });
      });
    };

    return {
      query,
    };
  }

  throw new Error(`Unsupported DATABASE_URL type: ${dbUrl}`);
};

export const pool = getDb();
