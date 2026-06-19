const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const BASE = "C:\\Users\\Bank Yan\\portal-dinas\\src\\data";

const ALL_SCHOOLS = [
  { nama: 'SD NEGERI 1 ASEM', npsn: '20215216', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 BELAWA', npsn: '20215230', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 BELAWA', npsn: '20215564', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 CIPEUJEUH KULON', npsn: '20215287', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 CIPEUJEUH KULON', npsn: '20215381', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 CIPEUJEUH WETAN', npsn: '20215286', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 CIPEUJEUH WETAN', npsn: '20215380', jenjang: 'SD' },
  { nama: 'SD NEGERI 3 CIPEUJEUH WETAN', npsn: '20214479', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 LEMAHABANG', npsn: '20215162', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 LEMAHABANG', npsn: '20214656', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 LEMAHABANG KULON', npsn: '20215161', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 LEUWIDINGDING', npsn: '20215164', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 PICUNGPUGUR', npsn: '20246442', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 SARAJAYA', npsn: '20215517', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 SARAJAYA', npsn: '20214726', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 SIGONG', npsn: '20215506', jenjang: 'SD' },
  { nama: 'SD NEGERI 3 SIGONG', npsn: '20214570', jenjang: 'SD' },
  { nama: 'SD NEGERI 4 SIGONG', npsn: '20244513', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 SINDANGLAUT', npsn: '20215464', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 TUK KARANGSUWUNG', npsn: '20246445', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 WANGKELANG', npsn: '20215584', jenjang: 'SD' },
  { nama: 'SD IT AL IRSYAD AL ISLAMIYYAH', npsn: '20215221', jenjang: 'SD' },
  { nama: 'TK NEGERI LEMAHABANG', npsn: '20270605', jenjang: 'TK' },
  { nama: 'TK AISYIYAH LEMAHABANG', npsn: '20254372', jenjang: 'TK' },
  { nama: 'TK AL-AQSO', npsn: '20254376', jenjang: 'TK' },
  { nama: 'TK AL-IRSYAD AL-ISLAMIYYAH', npsn: '20254373', jenjang: 'TK' },
  { nama: 'TK BPP KENANGA', npsn: '20254374', jenjang: 'TK' },
  { nama: 'TK GELATIK', npsn: '20254370', jenjang: 'TK' },
  { nama: 'TK MELATI', npsn: '20254378', jenjang: 'TK' },
  { nama: 'TK MUSLIMAT NU', npsn: '20254375', jenjang: 'TK' },
  { nama: 'KB A.H. PLUS', npsn: '70039880', jenjang: 'KB' },
  { nama: 'KB AMALIA SALSABILA', npsn: '69804039', jenjang: 'KB' },
  { nama: 'KB AZ-ZAHRA', npsn: '69804068', jenjang: 'KB' },
  { nama: 'KB MUTIARA', npsn: '70044538', jenjang: 'KB' },
  { nama: 'KB PALAPA', npsn: '69870486', jenjang: 'KB' },
  { nama: 'KB PERMATA BUNDA', npsn: '70024652', jenjang: 'KB' },
  { nama: 'PAUD AL HAMBRA', npsn: '69947715', jenjang: 'KB' },
  { nama: 'PAUD AL-HIDAYAH', npsn: '69870488', jenjang: 'KB' },
  { nama: 'PAUD AL-HUSNA', npsn: '69870479', jenjang: 'KB' },
  { nama: 'PAUD AMANAH', npsn: '69870482', jenjang: 'KB' },
  { nama: 'PAUD AN NAIM', npsn: '69870484', jenjang: 'KB' },
  { nama: 'PAUD ASY-SYAFIIYAH', npsn: '69870485', jenjang: 'KB' },
  { nama: 'PAUD BUDGENVIL', npsn: '69870489', jenjang: 'KB' },
  { nama: 'PAUD TUNAS HARAPAN', npsn: '69870490', jenjang: 'KB' },
  { nama: 'PAUD SPS MELATI', npsn: '69804044', jenjang: 'KB' },
];

function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

const SD_GRADE_COLS = { "1": "sd_g1", "2": "sd_g2", "3": "sd_g3", "4": "sd_g4", "5": "sd_g5", "6": "sd_g6" };
const PROM_COLS = {
  "1": ["sd_1_to_2_l", "sd_1_to_2_p"], "2": ["sd_2_to_3_l", "sd_2_to_3_p"],
  "3": ["sd_3_to_4_l", "sd_3_to_4_p"], "4": ["sd_4_to_5_l", "sd_4_to_5_p"],
  "5": ["sd_5_to_6_l", "sd_5_to_6_p"],
};
const TK_GRADE_COLS = { "A": "tk_a", "B": "tk_b" };
const KB_GRADE_COLS = { "PLAY": "kb_play", "CONT": "kb_cont" };

async function main() {
  try {
    const now = new Date().toISOString();

    // Build schoolMap from DB
    const { rows: schoolRows } = await client.execute("SELECT id, npsn, name, level FROM schools");
    const schoolMap = {};
    for (const r of schoolRows) schoolMap[r.npsn] = { id: r.id, name: r.name, level: r.level };
    console.log(`Found ${schoolRows.length} schools in DB`);

    const semuaSiswa = readJSON(path.join(BASE, "data-siswa.json"));
    console.log(`Loaded ${semuaSiswa.length} siswa`);

    // ── Aggregate current 2026/2027 data ──
    const counts26 = {}; // npsn_grade_jk → count
    const rombelSet26 = {};

    for (const siswa of semuaSiswa) {
      if (!schoolMap[siswa.npsn]) continue;
      const school = schoolMap[siswa.npsn];
      const jk = siswa.jk === "L" ? "l" : "p";
      const grade = parseGrade(siswa.kelas, siswa.rombel, school.level);
      if (!grade) continue;
      const key = `${siswa.npsn}_${grade}_${jk}`;
      counts26[key] = (counts26[key] || 0) + 1;
      if (siswa.rombel && siswa.rombel.trim()) {
        const rk = `${siswa.npsn}_${grade}`;
        if (!rombelSet26[rk]) rombelSet26[rk] = {};
        rombelSet26[rk][siswa.rombel.trim().toUpperCase()] = true;
      }
    }

    // ── Derive 2025/2026 counts from 2026/2027 by shifting ──
    const counts25 = {}; // npsn_grade_jk for 2025/2026
    const rombelSet25 = {};

    for (const s of ALL_SCHOOLS) {
      const npsn = s.npsn;
      if (!schoolMap[npsn]) continue;

      if (s.jenjang === "SD") {
        // Current G2→K1, G3→K2, G4→K3, G5→K4, G6→K5 in 2025/2026
        const shift = { "1": null, "2": "1", "3": "2", "4": "3", "5": "4", "6": "5" };
        for (let curG = 2; curG <= 6; curG++) {
          const prevG = shift[String(curG)];
          if (!prevG) continue;
          for (const jk of ["l", "p"]) {
            const val = counts26[`${npsn}_${curG}_${jk}`] || 0;
            if (val > 0) counts25[`${npsn}_${prevG}_${jk}`] = val;
          }
          // Copy rombel
          const srcRk = `${npsn}_${curG}`;
          const dstRk = `${npsn}_${prevG}`;
          if (rombelSet26[srcRk]) {
            rombelSet25[dstRk] = { ...rombelSet26[srcRk] };
          }
        }
      } else if (s.jenjang === "TK") {
        // TK A/B—approximate: same counts for previous year
        for (const g of ["A", "B"]) {
          for (const jk of ["l", "p"]) {
            const val = counts26[`${npsn}_${g}_${jk}`] || 0;
            if (val > 0) counts25[`${npsn}_${g}_${jk}`] = val;
          }
          const srcRk = `${npsn}_${g}`;
          if (rombelSet26[srcRk]) rombelSet25[srcRk] = { ...rombelSet26[srcRk] };
        }
      } else if (s.jenjang === "KB") {
        for (const g of ["PLAY", "CONT"]) {
          for (const jk of ["l", "p"]) {
            const val = counts26[`${npsn}_${g}_${jk}`] || 0;
            if (val > 0) counts25[`${npsn}_${g}_${jk}`] = val;
          }
          const srcRk = `${npsn}_${g}`;
          if (rombelSet26[srcRk]) rombelSet25[srcRk] = { ...rombelSet26[srcRk] };
        }
      }
    }

    // ── Insert 2025/2026 class_groups ──
    for (const [rk, rombels] of Object.entries(rombelSet25)) {
      const parts = rk.split("_");
      const npsn = parts[0];
      const grade = parts.slice(1).join("_");
      const sch = schoolMap[npsn];
      if (!sch) continue;
      let col = null;
      if (sch.level === "SD") col = SD_GRADE_COLS[grade];
      else if (sch.level === "TK") col = TK_GRADE_COLS[grade];
      else if (sch.level === "KB") col = KB_GRADE_COLS[grade];
      if (!col) continue;

      let rc = Object.keys(rombels).length;
      if (rc === 1) {
        const total = (counts25[`${npsn}_${grade}_l`] || 0) + (counts25[`${npsn}_${grade}_p`] || 0);
        rc = Math.max(1, Math.ceil(total / (sch.level === "SD" ? 28 : sch.level === "TK" ? 20 : 15)));
      }
      try {
        await client.execute({
          sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                VALUES (?, ?, '2025/2026', ?, ?, ?, 'import')`,
          args: [`cg_${sch.id}_${grade}_2025`, sch.id, rc, now, now],
        });
      } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
    }

    // Fill missing grades for 2025/2026
    for (const s of ALL_SCHOOLS) {
      const sch = schoolMap[s.npsn];
      if (!sch) continue;
      if (sch.level === "SD") {
        for (let g = 1; g <= 5; g++) {
          const col = SD_GRADE_COLS[String(g)];
          const rk = `${s.npsn}_${g}`;
          if (!rombelSet25[rk]) {
            const total = (counts25[`${s.npsn}_${g}_l`] || 0) + (counts25[`${s.npsn}_${g}_p`] || 0);
            if (total > 0) {
              try {
                await client.execute({
                  sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                        VALUES (?, ?, '2025/2026', ?, ?, ?, 'import')`,
                  args: [`cg_${sch.id}_${g}_2025`, sch.id, Math.max(1, Math.ceil(total / 28)), now, now],
                });
              } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
            }
          }
        }
      } else if (sch.level === "TK") {
        for (const [g, col] of Object.entries(TK_GRADE_COLS)) {
          const total = (counts25[`${s.npsn}_${g}_l`] || 0) + (counts25[`${s.npsn}_${g}_p`] || 0);
          if (total > 0) {
            try {
              await client.execute({
                sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                      VALUES (?, ?, '2025/2026', ?, ?, ?, 'import')`,
                args: [`cg_${sch.id}_${g}_2025`, sch.id, Math.max(1, Math.ceil(total / 20)), now, now],
              });
            } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
          }
        }
      } else if (sch.level === "KB") {
        for (const [g, col] of Object.entries(KB_GRADE_COLS)) {
          const total = (counts25[`${s.npsn}_${g}_l`] || 0) + (counts25[`${s.npsn}_${g}_p`] || 0);
          if (total > 0) {
            try {
              await client.execute({
                sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                      VALUES (?, ?, '2025/2026', ?, ?, ?, 'import')`,
                args: [`cg_${sch.id}_${g}_2025`, sch.id, Math.max(1, Math.ceil(total / 15)), now, now],
              });
            } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
          }
        }
      }
    }
    console.log("Imported class_groups 2025/2026");

    // ── Insert 2025/2026 student_promotions ──
    for (const s of ALL_SCHOOLS) {
      const sch = schoolMap[s.npsn];
      if (!sch) continue;
      const cols = [];
      const vals = [];

      if (s.jenjang === "SD") {
        for (let g = 1; g <= 5; g++) {
          const l = counts25[`${s.npsn}_${g}_l`] || 0;
          const p = counts25[`${s.npsn}_${g}_p`] || 0;
          const [cL, cP] = PROM_COLS[String(g)];
          cols.push(cL, cP);
          vals.push(l, p);
        }
      } else if (s.jenjang === "TK") {
        cols.push("tk_a_to_b_l", "tk_a_to_b_p");
        vals.push(counts25[`${s.npsn}_B_l`] || 0, counts25[`${s.npsn}_B_p`] || 0);
      } else if (s.jenjang === "KB") {
        cols.push("kb_play_to_cont_l", "kb_play_to_cont_p");
        vals.push(counts25[`${s.npsn}_CONT_l`] || 0, counts25[`${s.npsn}_CONT_p`] || 0);
      }

      if (vals.some(v => v > 0)) {
        try {
          await client.execute({
            sql: `INSERT INTO student_promotions (id, school_id, year, ${cols.join(", ")}, created_at, updated_at, created_by)
                  VALUES (?, ?, '2025/2026', ${cols.map(() => "?").join(", ")}, ?, ?, 'import')`,
            args: [`sp_${sch.id}_2025`, sch.id, ...vals, now, now],
          });
        } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
      }
    }
    console.log("Imported student_promotions 2025/2026");

    // ── Insert 2025/2026 student_admissions (K1 = current G2) ──
    for (const s of ALL_SCHOOLS) {
      const sch = schoolMap[s.npsn];
      if (!sch) continue;
      let l = 0, p = 0;
      if (s.jenjang === "SD") {
        l = counts25[`${s.npsn}_1_l`] || 0;
        p = counts25[`${s.npsn}_1_p`] || 0;
      } else if (s.jenjang === "TK") {
        l = counts25[`${s.npsn}_A_l`] || 0;
        p = counts25[`${s.npsn}_A_p`] || 0;
      } else if (s.jenjang === "KB") {
        l = counts25[`${s.npsn}_PLAY_l`] || 0;
        p = counts25[`${s.npsn}_PLAY_p`] || 0;
      }
      if (l + p > 0) {
        try {
          await client.execute({
            sql: `INSERT INTO student_admissions (id, school_id, year, domisili_l, domisili_p, afirmasi_l, afirmasi_p, mutasi_l, mutasi_p, created_at, updated_at, created_by)
                  VALUES (?, ?, '2025/2026', ?, ?, 0, 0, 0, 0, ?, ?, 'import')`,
            args: [`sa_${sch.id}_2025`, sch.id, l, p, now, now],
          });
        } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
      }
    }
    console.log("Imported student_admissions 2025/2026");

    // ── Insert 2025/2026 alumni = K6 of 2024/2025 ≈ current G5 ──
    // Also alumni 2024/2025 ≈ current G6 (they graduated before 2025/2026)
    for (const s of ALL_SCHOOLS) {
      const sch = schoolMap[s.npsn];
      if (!sch) continue;
      // Alumni 2024/2025 = students who graduated before 2025/2026 ≈ current G6
      let l = 0, p = 0;
      if (s.jenjang === "SD") {
        l = counts26[`${s.npsn}_6_l`] || 0;
        p = counts26[`${s.npsn}_6_p`] || 0;
      } else if (s.jenjang === "TK") {
        l = counts26[`${s.npsn}_B_l`] || 0;
        p = counts26[`${s.npsn}_B_p`] || 0;
      } else if (s.jenjang === "KB") {
        l = counts26[`${s.npsn}_CONT_l`] || 0;
        p = counts26[`${s.npsn}_CONT_p`] || 0;
      }
      if (l + p > 0) {
        try {
          await client.execute({
            sql: `INSERT INTO alumni (id, school_id, year, l, p, created_at, updated_at, created_by)
                  VALUES (?, ?, '2024/2025', ?, ?, ?, ?, 'import')`,
            args: [`al_${sch.id}_2024`, sch.id, l, p, now, now],
          });
        } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
      }

      // continuing 2025/2026 = same as alumni above
      if (l + p > 0) {
        try {
          await client.execute({
            sql: `INSERT INTO continuing_students (id, school_id, year, l, p, created_at, updated_at, created_by)
                  VALUES (?, ?, '2025/2026', ?, ?, ?, ?, 'import')`,
            args: [`cs_${sch.id}_2025`, sch.id, l, p, now, now],
          });
          await client.execute({
            sql: `INSERT INTO non_continuing_students (id, school_id, year, l, p, created_at, updated_at, created_by)
                  VALUES (?, ?, '2025/2026', 0, 0, ?, ?, 'import')`,
            args: [`nc_${sch.id}_2025`, sch.id, now, now],
          });
        } catch (e) { if (!e.message.includes("UNIQUE")) throw e; }
      }
    }
    console.log("Imported alumni/continuing 2024/2025 & 2025/2026");

    console.log("\n=== Data TP 2025/2026 selesai ditambahkan! ===");
    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    console.error(e);
    process.exit(1);
  }
}

const ROMAN = { I: "1", II: "2", III: "3", IV: "4", V: "5", VI: "6" };
function parseGrade(kelasStr, rombelStr, level) {
  if (level === "SD") {
    if (kelasStr || kelasStr === 0) {
      const m = String(kelasStr).match(/(\d)/);
      if (m) return m[1];
    }
    const r = (rombelStr || "").toUpperCase().trim();
    const parts = r.split(/\s+/);
    if (parts.length > 0 && ROMAN[parts[0]]) return ROMAN[parts[0]];
    return null;
  }
  if (level === "TK") {
    const r = (rombelStr || "").toUpperCase();
    if (r.includes("A")) return "A";
    if (r.includes("B")) return "B";
    return "A";
  }
  if (level === "KB") {
    const r = (rombelStr || "").toUpperCase();
    if (r.includes("PLAY") || r.includes("PG") || r.includes("A")) return "PLAY";
    return "CONT";
  }
  return null;
}

main();
