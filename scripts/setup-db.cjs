const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").join(__dirname, "..", ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const seedSchools = [
  { id: "SD_01", npsn: "12345678", name: "SD Negeri 1 Merdeka", level: "SD", address: "Jl. Pendidikan No. 12, Kecamatan Utama", status: "VALID", created_by: "system" },
  { id: "SD_02", npsn: "23456789", name: "SD Swasta Bhakti Luhur", level: "SD", address: "Jl. Merdeka No. 45, Kecamatan Utama", status: "PENDING", created_by: "system" },
  { id: "TK_01", npsn: "34567890", name: "TK Kasih Ibu", level: "TK", address: "Jl. Melati Raya No. 3, Kecamatan Utama", status: "VALID", created_by: "system" },
  { id: "TK_02", npsn: "45678901", name: "TK Kartini Mandiri", level: "TK", address: "Jl. Raden Kartini No. 8, Kecamatan Utama", status: "PENDING", created_by: "system" },
  { id: "KB_01", npsn: "56789012", name: "KB Melati Indah", level: "KB", address: "Komp. Asri Blok D No. 2, Kecamatan Utama", status: "VALID", created_by: "system" },
  { id: "KB_02", npsn: "67890123", name: "KB Sinar Mentari", level: "KB", address: "Komp. Griya Kencana No. 15, Kecamatan Utama", status: "PENDING", created_by: "system" },
];

async function setup() {
  try {
    // Create tables
    await client.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id TEXT PRIMARY KEY,
        npsn TEXT NOT NULL DEFAULT '',
        name TEXT NOT NULL,
        level TEXT NOT NULL CHECK(level IN ('SD', 'TK', 'KB')),
        address TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('VALID', 'PENDING')),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'system'
      )
    `);
    console.log("Created schools table");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('PUBLIK', 'OPERATOR', 'ADMIN')),
        school_id TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'system',
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )
    `);
    console.log("Created users table");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS student_admissions (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        year TEXT NOT NULL DEFAULT '2026/2027',
        domisili_l INTEGER NOT NULL DEFAULT 0,
        domisili_p INTEGER NOT NULL DEFAULT 0,
        afirmasi_l INTEGER NOT NULL DEFAULT 0,
        afirmasi_p INTEGER NOT NULL DEFAULT 0,
        mutasi_l INTEGER NOT NULL DEFAULT 0,
        mutasi_p INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'operator',
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )
    `);
    console.log("Created student_admissions table");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS student_promotions (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        year TEXT NOT NULL DEFAULT '2026/2027',
        sd_1_to_2_l INTEGER, sd_1_to_2_p INTEGER,
        sd_2_to_3_l INTEGER, sd_2_to_3_p INTEGER,
        sd_3_to_4_l INTEGER, sd_3_to_4_p INTEGER,
        sd_4_to_5_l INTEGER, sd_4_to_5_p INTEGER,
        sd_5_to_6_l INTEGER, sd_5_to_6_p INTEGER,
        tk_a_to_b_l INTEGER, tk_a_to_b_p INTEGER,
        kb_play_to_cont_l INTEGER, kb_play_to_cont_p INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'operator',
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )
    `);
    console.log("Created student_promotions table");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS class_groups (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        year TEXT NOT NULL DEFAULT '2026/2027',
        sd_g1 INTEGER NOT NULL DEFAULT 0, sd_g2 INTEGER NOT NULL DEFAULT 0,
        sd_g3 INTEGER NOT NULL DEFAULT 0, sd_g4 INTEGER NOT NULL DEFAULT 0,
        sd_g5 INTEGER NOT NULL DEFAULT 0, sd_g6 INTEGER NOT NULL DEFAULT 0,
        tk_a INTEGER NOT NULL DEFAULT 0, tk_b INTEGER NOT NULL DEFAULT 0,
        kb_play INTEGER NOT NULL DEFAULT 0, kb_cont INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'operator',
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )
    `);
    console.log("Created class_groups table");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS alumni (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        year TEXT NOT NULL DEFAULT '2025/2026',
        l INTEGER NOT NULL DEFAULT 0,
        p INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'operator',
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )
    `);
    console.log("Created alumni table");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS continuing_students (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        year TEXT NOT NULL DEFAULT '2026/2027',
        l INTEGER NOT NULL DEFAULT 0,
        p INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'operator',
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )
    `);
    console.log("Created continuing_students table");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS non_continuing_students (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        year TEXT NOT NULL DEFAULT '2026/2027',
        l INTEGER NOT NULL DEFAULT 0,
        p INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_by TEXT NOT NULL DEFAULT 'operator',
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )
    `);
    console.log("Created non_continuing_students table");

    // Seed schools
    const existing = await client.execute("SELECT COUNT(*) as cnt FROM schools");
    if (existing.rows[0].cnt === 0) {
      for (const sch of seedSchools) {
        await client.execute({
          sql: "INSERT INTO schools (id, npsn, name, level, address, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
          args: [sch.id, sch.npsn, sch.name, sch.level, sch.address, sch.status, sch.created_by],
        });
      }
      console.log("Seeded schools");

      const now = new Date().toISOString();

      // Seed admissions
      const admissions = [
        { id: "SD_01_2026", schoolId: "SD_01", domisili_l: 24, domisili_p: 20, afirmasi_l: 8, afirmasi_p: 10, mutasi_l: 2, mutasi_p: 3, created_by: "opsd" },
        { id: "SD_02_2026", schoolId: "SD_02", domisili_l: 15, domisili_p: 18, afirmasi_l: 5, afirmasi_p: 6, mutasi_l: 1, mutasi_p: 1, created_by: "opsd2" },
        { id: "TK_01_2026", schoolId: "TK_01", domisili_l: 12, domisili_p: 14, afirmasi_l: 3, afirmasi_p: 4, mutasi_l: 0, mutasi_p: 1, created_by: "optk" },
        { id: "TK_02_2026", schoolId: "TK_02", domisili_l: 10, domisili_p: 8, afirmasi_l: 2, afirmasi_p: 2, mutasi_l: 1, mutasi_p: 0, created_by: "optk2" },
        { id: "KB_01_2026", schoolId: "KB_01", domisili_l: 8, domisili_p: 9, afirmasi_l: 1, afirmasi_p: 2, mutasi_l: 0, mutasi_p: 0, created_by: "opkb" },
        { id: "KB_02_2026", schoolId: "KB_02", domisili_l: 7, domisili_p: 6, afirmasi_l: 2, afirmasi_p: 1, mutasi_l: 1, mutasi_p: 0, created_by: "opkb2" },
      ];
      for (const a of admissions) {
        await client.execute({
          sql: "INSERT INTO student_admissions (id, school_id, year, domisili_l, domisili_p, afirmasi_l, afirmasi_p, mutasi_l, mutasi_p, created_by) VALUES (?, ?, '2026/2027', ?, ?, ?, ?, ?, ?, ?)",
          args: [a.id, a.schoolId, a.domisili_l, a.domisili_p, a.afirmasi_l, a.afirmasi_p, a.mutasi_l, a.mutasi_p, a.created_by],
        });
      }
      console.log("Seeded admissions");

      // Seed promotions
      const promotions = [
        { id: "SD_01_2026", schoolId: "SD_01", sd_1_to_2_l: 22, sd_1_to_2_p: 19, sd_2_to_3_l: 20, sd_2_to_3_p: 21, sd_3_to_4_l: 18, sd_3_to_4_p: 17, sd_4_to_5_l: 23, sd_4_to_5_p: 22, sd_5_to_6_l: 19, sd_5_to_6_p: 20, created_by: "opsd" },
        { id: "SD_02_2026", schoolId: "SD_02", sd_1_to_2_l: 14, sd_1_to_2_p: 15, sd_2_to_3_l: 16, sd_2_to_3_p: 14, sd_3_to_4_l: 15, sd_3_to_4_p: 13, sd_4_to_5_l: 17, sd_4_to_5_p: 16, sd_5_to_6_l: 12, sd_5_to_6_p: 15, created_by: "opsd2" },
        { id: "TK_01_2026", schoolId: "TK_01", tk_a_to_b_l: 15, tk_a_to_b_p: 16, created_by: "optk" },
        { id: "TK_02_2026", schoolId: "TK_02", tk_a_to_b_l: 9, tk_a_to_b_p: 10, created_by: "optk2" },
        { id: "KB_01_2026", schoolId: "KB_01", kb_play_to_cont_l: 10, kb_play_to_cont_p: 8, created_by: "opkb" },
        { id: "KB_02_2026", schoolId: "KB_02", kb_play_to_cont_l: 6, kb_play_to_cont_p: 7, created_by: "opkb2" },
      ];
      for (const p of promotions) {
        await client.execute({
          sql: "INSERT INTO student_promotions (id, school_id, year, sd_1_to_2_l, sd_1_to_2_p, sd_2_to_3_l, sd_2_to_3_p, sd_3_to_4_l, sd_3_to_4_p, sd_4_to_5_l, sd_4_to_5_p, sd_5_to_6_l, sd_5_to_6_p, tk_a_to_b_l, tk_a_to_b_p, kb_play_to_cont_l, kb_play_to_cont_p, created_by) VALUES (?, ?, '2026/2027', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          args: [p.id, p.schoolId, p.sd_1_to_2_l ?? null, p.sd_1_to_2_p ?? null, p.sd_2_to_3_l ?? null, p.sd_2_to_3_p ?? null, p.sd_3_to_4_l ?? null, p.sd_3_to_4_p ?? null, p.sd_4_to_5_l ?? null, p.sd_4_to_5_p ?? null, p.sd_5_to_6_l ?? null, p.sd_5_to_6_p ?? null, p.tk_a_to_b_l ?? null, p.tk_a_to_b_p ?? null, p.kb_play_to_cont_l ?? null, p.kb_play_to_cont_p ?? null, p.created_by],
        });
      }
      console.log("Seeded promotions");

      // Seed class groups
      const rombels = [
        { id: "SD_01_2026", schoolId: "SD_01", sd_g1: 2, sd_g2: 2, sd_g3: 2, sd_g4: 2, sd_g5: 2, sd_g6: 2, created_by: "opsd" },
        { id: "SD_02_2026", schoolId: "SD_02", sd_g1: 1, sd_g2: 1, sd_g3: 1, sd_g4: 1, sd_g5: 1, sd_g6: 1, created_by: "opsd2" },
        { id: "TK_01_2026", schoolId: "TK_01", tk_a: 1, tk_b: 1, created_by: "optk" },
        { id: "TK_02_2026", schoolId: "TK_02", tk_a: 1, tk_b: 1, created_by: "optk2" },
        { id: "KB_01_2026", schoolId: "KB_01", kb_play: 1, kb_cont: 1, created_by: "opkb" },
        { id: "KB_02_2026", schoolId: "KB_02", kb_play: 1, kb_cont: 1, created_by: "opkb2" },
      ];
      for (const r of rombels) {
        await client.execute({
          sql: "INSERT INTO class_groups (id, school_id, year, sd_g1, sd_g2, sd_g3, sd_g4, sd_g5, sd_g6, tk_a, tk_b, kb_play, kb_cont, created_by) VALUES (?, ?, '2026/2027', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          args: [r.id, r.schoolId, r.sd_g1 ?? 0, r.sd_g2 ?? 0, r.sd_g3 ?? 0, r.sd_g4 ?? 0, r.sd_g5 ?? 0, r.sd_g6 ?? 0, r.tk_a ?? 0, r.tk_b ?? 0, r.kb_play ?? 0, r.kb_cont ?? 0, r.created_by],
        });
      }
      console.log("Seeded class groups");

      // Seed alumni
      const alumni = [
        { id: "SD_01_2025", schoolId: "SD_01", l: 18, p: 16, created_by: "opsd" },
        { id: "SD_02_2025", schoolId: "SD_02", l: 10, p: 12, created_by: "opsd2" },
        { id: "TK_01_2025", schoolId: "TK_01", l: 14, p: 15, created_by: "optk" },
        { id: "TK_02_2025", schoolId: "TK_02", l: 8, p: 9, created_by: "optk2" },
        { id: "KB_01_2025", schoolId: "KB_01", l: 9, p: 8, created_by: "opkb" },
        { id: "KB_02_2025", schoolId: "KB_02", l: 6, p: 5, created_by: "opkb2" },
      ];
      for (const al of alumni) {
        await client.execute({
          sql: "INSERT INTO alumni (id, school_id, year, l, p, created_by) VALUES (?, ?, '2025/2026', ?, ?, ?)",
          args: [al.id, al.schoolId, al.l, al.p, al.created_by],
        });
      }
      console.log("Seeded alumni");

      // Seed continuing
      const continuing = [
        { id: "SD_01_2026", schoolId: "SD_01", l: 17, p: 16, created_by: "opsd" },
        { id: "SD_02_2026", schoolId: "SD_02", l: 9, p: 11, created_by: "opsd2" },
        { id: "TK_01_2026", schoolId: "TK_01", l: 14, p: 14, created_by: "optk" },
        { id: "TK_02_2026", schoolId: "TK_02", l: 7, p: 8, created_by: "optk2" },
        { id: "KB_01_2026", schoolId: "KB_01", l: 9, p: 7, created_by: "opkb" },
        { id: "KB_02_2026", schoolId: "KB_02", l: 5, p: 5, created_by: "opkb2" },
      ];
      for (const c of continuing) {
        await client.execute({
          sql: "INSERT INTO continuing_students (id, school_id, year, l, p, created_by) VALUES (?, ?, '2026/2027', ?, ?, ?)",
          args: [c.id, c.schoolId, c.l, c.p, c.created_by],
        });
      }
      console.log("Seeded continuing students");

      // Seed non-continuing
      const nonContinuing = [
        { id: "SD_01_2026", schoolId: "SD_01", l: 1, p: 0, created_by: "opsd" },
        { id: "SD_02_2026", schoolId: "SD_02", l: 1, p: 1, created_by: "opsd2" },
        { id: "TK_01_2026", schoolId: "TK_01", l: 0, p: 1, created_by: "optk" },
        { id: "TK_02_2026", schoolId: "TK_02", l: 1, p: 1, created_by: "optk2" },
        { id: "KB_01_2026", schoolId: "KB_01", l: 0, p: 1, created_by: "opkb" },
        { id: "KB_02_2026", schoolId: "KB_02", l: 1, p: 0, created_by: "opkb2" },
      ];
      for (const nc of nonContinuing) {
        await client.execute({
          sql: "INSERT INTO non_continuing_students (id, school_id, year, l, p, created_by) VALUES (?, ?, '2026/2027', ?, ?, ?)",
          args: [nc.id, nc.schoolId, nc.l, nc.p, nc.created_by],
        });
      }
      console.log("Seeded non-continuing students");
    } else {
      console.log("Schools already seeded, skipping");
    }

    console.log("Database setup complete!");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

setup();
