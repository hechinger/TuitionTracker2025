require("dotenv").config();
const pg = require("pg");
const sqlite3 = require("sqlite3");

const dbUrl = process.env.DATABASE_URL;

const getDb = async () => {
  const pgClient = dbUrl.startsWith("postgresql") && new pg.Pool({
    connectionString: dbUrl,
  });
  const sqliteClient = dbUrl.startsWith("sqlite") && new sqlite3.Database(
    dbUrl.slice("sqlite://".length),
  );

  const serial = dbUrl.startsWith("postgresql")
    ? "SERIAL PRIMARY KEY"
    : "INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL";

  const get = async (queryOpts) => {
    if (dbUrl.startsWith("postgresql")) {
      if (!pgClient) throw new Error("Unconfigured database");
      const rsp = await pgClient.query(queryOpts);
      return rsp.rows;
    }

    if (dbUrl.startsWith("sqlite")) {
      if (!sqliteClient) throw new Error("Unconfigured database");
      const q = (typeof queryOpts === "string")
        ? { text: queryOpts, values: [] }
        : queryOpts;
      const rows = await new Promise((resolve, reject) => {
        const { text, values } = q;
        const valueObject = Object.fromEntries(values.map((v, i) => [
          `$${i + 1}`,
          v,
        ]));
        sqliteClient.all(text, valueObject, function(error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
      return rows;
    }
  };

  const query = async (queryOpts) => {
    if (dbUrl.startsWith("postgresql")) {
      if (!pgClient) throw new Error("Unconfigured database");
      await pgClient.query(queryOpts);
      return;
    }

    if (dbUrl.startsWith("sqlite")) {
      if (!sqliteClient) throw new Error("Unconfigured database");
      await new Promise((resolve, reject) => {
        const q = (typeof queryOpts === "string")
          ? { text: queryOpts, values: [] }
          : queryOpts;
        const { text, values } = q;
        const valueObject = Object.fromEntries(values.map((v, i) => [
          `$${i + 1}`,
          v,
        ]));
        sqliteClient.run(text, valueObject, function(error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      return;
    }
  };

  const end = async () => {
    if (sqliteClient) {
      sqliteClient.close();
    }
    if (pgClient) {
      await pgClient.end();
    }
  };

  return {
    serial,
    get,
    query,
    end,
  };
};

const main = async () => {
  const db = await getDb();

  try {
    await db.query("CREATE TABLE schools (id SERIAL PRIMARY KEY);");
  } catch (error) {
    console.error(error);
  } finally {
    db.end();
  }
};

main();
