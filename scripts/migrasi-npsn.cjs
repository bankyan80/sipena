const { createClient } = require("@libsql/client");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });

const c = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    await c.execute("ALTER TABLE schools ADD COLUMN npsn TEXT NOT NULL DEFAULT ''");
  } catch {}
  await c.execute("UPDATE schools SET npsn = '12345678' WHERE id = 'SD_01'");
  await c.execute("UPDATE schools SET npsn = '23456789' WHERE id = 'SD_02'");
  await c.execute("UPDATE schools SET npsn = '34567890' WHERE id = 'TK_01'");
  await c.execute("UPDATE schools SET npsn = '45678901' WHERE id = 'TK_02'");
  await c.execute("UPDATE schools SET npsn = '56789012' WHERE id = 'KB_01'");
  await c.execute("UPDATE schools SET npsn = '67890123' WHERE id = 'KB_02'");
  console.log("NPSN migration done");
}
run().catch((e) => console.error(e.message));
