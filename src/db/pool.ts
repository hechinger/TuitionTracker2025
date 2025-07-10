import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: dbUrl,
});
