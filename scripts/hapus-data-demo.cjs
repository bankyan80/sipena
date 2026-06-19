const { createClient } = require("@libsql/client");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });

const c = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  const tables = [
    "non_continuing_students",
    "continuing_students",
    "alumni",
    "class_groups",
    "student_promotions",
    "student_admissions",
    "users",
    "schools",
  ];
  for (const t of tables) {
    await c.execute(`DELETE FROM ${t}`);
    console.log(`Cleared ${t}`);
  }
  console.log("All demo data removed");
}
run().catch((e) => console.error(e.message));
