require("dotenv").config();
const pg = require("pg");

const dbUrl = process.env.DATABASE_URL;

const db = new pg.Pool({
  connectionString: dbUrl,
});

const main = async () => {
  await db.query("ALTER TABLE schools ADD image_credit TEXT;");
};

main();
