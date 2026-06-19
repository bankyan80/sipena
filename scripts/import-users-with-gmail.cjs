const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const DATA_DIR = "C:\\Users\\Bank Yan\\portal-dinas\\src\\data";

// ── Canonical school aliases ──
function loadCanonicalAliases() {
  const raw = fs.readFileSync(path.join(DATA_DIR, "canonical-schools.json"), "utf8");
  const canonical = JSON.parse(raw.replace(/^\uFEFF/, ""));
  const map = {};
  for (const schools of Object.values(canonical)) {
    for (const [canonicalName, aliases] of Object.entries(schools)) {
      for (const alias of aliases) {
        map[alias.toLowerCase().trim()] = canonicalName;
      }
    }
  }
  return map;
}

// ── Build npsn lookup from schools table ──
async function buildNpsnLookup() {
  const aliasMap = loadCanonicalAliases();
  const { rows } = await client.execute("SELECT id, npsn, name FROM schools");
  const byNpsn = {}; // npsn -> id
  const byName = {}; // canonical name lower -> id
  for (const r of rows) {
    byNpsn[r.npsn] = r.id;
    byName[r.name.toLowerCase()] = r.id;
  }

  const canonicalNames = {};
  for (const [alias, canonical] of Object.entries(aliasMap)) {
    canonicalNames[alias] = canonical.toLowerCase();
  }

  function lookup(schoolName) {
    if (!schoolName) return null;
    const key = schoolName.toLowerCase().trim();
    // direct match
    if (byName[key]) return byName[key];
    // canonical alias match
    const canon = aliasMap[key];
    if (canon && byName[canon.toLowerCase()]) return byName[canon.toLowerCase()];
    // fuzzy: remove "kecamatan ..." suffix
    const cleaned = key.replace(/kecamatan\s+\S+$/, "").trim();
    if (byName[cleaned]) return byName[cleaned];
    if (canonicalNames[cleaned] && byName[canonicalNames[cleaned]]) return byName[canonicalNames[cleaned]];
    return null;
  }

  return lookup;
}

function parseCSV(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split("\n").map(l => l.trim()).filter(l => l);

  // Line 2 = school name
  let schoolName = (lines[1] || "").replace(/,/g, " ").trim();

  // Line 5 = header
  const header = lines[4] ? lines[4].split(",").map(h => h.trim()) : [];

  const nameIdx = header.indexOf("Nama");
  const emailIdx = header.indexOf("Email");
  if (nameIdx === -1 || emailIdx === -1) return [];

  const records = [];
  for (let i = 5; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    const name = cols[nameIdx];
    const email = cols[emailIdx];
    if (name && email && email.includes("@gmail.com")) {
      records.push({ name, email, schoolName });
    }
  }
  return records;
}

async function main() {
  try {
    const lookup = await buildNpsnLookup();
    const now = new Date().toISOString();

    // ── Hapus semua users ──
    await client.execute("DELETE FROM users");
    console.log("Cleared users table");

    // ── Parse semua CSV ──
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".csv"));
    const allUsers = [];
    for (const f of files) {
      const records = parseCSV(path.join(DATA_DIR, f));
      allUsers.push(...records);
    }

    // Dedup by email
    const seen = new Set();
    const unique = [];
    for (const u of allUsers) {
      const key = u.email.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(u);
    }

    console.log(`Found ${unique.length} unique users with Gmail from ${files.length} CSV files`);

    // ── Insert ──
    let imported = 0;
    let skipped = 0;
    for (const u of unique) {
      const schoolId = lookup(u.schoolName);
      if (!schoolId) {
        console.warn(`  SKIP ${u.name} - unknown school: ${u.schoolName}`);
        skipped++;
        continue;
      }

      const id = `usr_${u.email.split("@")[0].replace(/[^a-z0-9]/gi, "_")}`;
      const username = u.email;

      try {
        await client.execute({
          sql: `INSERT INTO users (id, username, name, role, school_id, created_at, updated_at, created_by)
                VALUES (?, ?, ?, 'OPERATOR', ?, ?, ?, 'import')`,
          args: [id, username, u.name, schoolId, now, now],
        });
        imported++;
      } catch (e) {
        if (e.message.includes("UNIQUE constraint")) {
          console.warn(`  SKIP duplicate: ${u.email}`);
          skipped++;
        } else {
          throw e;
        }
      }
    }

    console.log(`\nImported ${imported} users with Gmail, skipped ${skipped}`);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    console.error(e);
    process.exit(1);
  }
}

main();
