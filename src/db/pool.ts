import { Pool, type QueryResultRow } from "pg";

const dbUrl = process.env.DATABASE_URL;

const getDbType = () => {
  if (!dbUrl) {
    throw new Error("Must specify DATABASE_URL in .env file");
  }

  if (dbUrl.startsWith("postgres")) {
    return { type: "postgres", url: dbUrl };
  }

  throw new Error(`Unsupported DATABASE_URL type: ${dbUrl}`);
};

const db = getDbType();

const pool = db.type === "postgres" && new Pool({
  connectionString: db.url,
});

type QueryConfig = {
  text: string;
  values: unknown[];
  jsonColumns?: string[];
};

export const queryRows = async <T extends QueryResultRow>(query: string | QueryConfig) => {
  const db = getDbType();

  if (db.type === "postgres") {
    if (!pool) throw new Error("Unconfigured database");
    const rsp = await pool.query<T>(query);
    return rsp.rows;
  }

  throw new Error("Unconfigured database");
};

export const run = async (query: string | QueryConfig) => {
  const db = getDbType();

  if (db.type === "postgres") {
    if (!pool) throw new Error("Unconfigured database");
    await pool.query(query);
    return;
  }

  throw new Error("Unconfigured database");
};
