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

// ── 45 schools from portal-dinas/src/data/sekolah.ts ──
const ALL_SCHOOLS = [
  // SD (22)
  { nama: 'SD NEGERI 1 ASEM', npsn: '20215216', status: 'NEGERI', address: 'Jl. Abdurachman Saleh No. 328, Asem', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 BELAWA', npsn: '20215230', status: 'NEGERI', address: 'Jl. Cikuya 1, Belawa', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 BELAWA', npsn: '20215564', status: 'NEGERI', address: 'Jl. Inpres Blok A, Belawa', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 CIPEUJEUH KULON', npsn: '20215287', status: 'NEGERI', address: 'Jl. K.H. Hasyim Asyari No. 07, Cipeujeuh Kulon', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 CIPEUJEUH KULON', npsn: '20215381', status: 'NEGERI', address: 'Jl. KH. Hasyim Asyari No. 500, Cipeujeuh Kulon', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 CIPEUJEUH WETAN', npsn: '20215286', status: 'NEGERI', address: 'Jl. MT. Haryono No. 62, Cipeujeuh Wetan', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 CIPEUJEUH WETAN', npsn: '20215380', status: 'NEGERI', address: 'Jl. MT. Haryono No. 3B, Cipeujeuh Wetan', jenjang: 'SD' },
  { nama: 'SD NEGERI 3 CIPEUJEUH WETAN', npsn: '20214479', status: 'NEGERI', address: 'Jl. KH. Wahid Hasyim No. 66, Cipeujeuh Wetan', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 LEMAHABANG', npsn: '20215162', status: 'NEGERI', address: 'Jl. Ki Hajar Dewantoro No. 35, Lemahabang', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 LEMAHABANG', npsn: '20214656', status: 'NEGERI', address: 'Jl. R.A. Kartini No. 26, Lemahabang', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 LEMAHABANG KULON', npsn: '20215161', status: 'NEGERI', address: 'Jl. Syech Lemahabang No. 5, Lemahabang Kulon', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 LEUWIDINGDING', npsn: '20215164', status: 'NEGERI', address: 'Jl. Abdurahman Saleh, Leuwidingding', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 PICUNGPUGUR', npsn: '20246442', status: 'NEGERI', address: 'Jl. Raya Desa Picungpugur, Picungpugur', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 SARAJAYA', npsn: '20215517', status: 'NEGERI', address: 'Jl. Raya Sarajaya No. 63, Sarajaya', jenjang: 'SD' },
  { nama: 'SD NEGERI 2 SARAJAYA', npsn: '20214726', status: 'NEGERI', address: 'Jl. Raya Sarajaya Subur No. 1, Sarajaya', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 SIGONG', npsn: '20215506', status: 'NEGERI', address: 'Jl. Pelita No. 101, Sigong', jenjang: 'SD' },
  { nama: 'SD NEGERI 3 SIGONG', npsn: '20214570', status: 'NEGERI', address: 'Jl. Raya Sigong, Sigong', jenjang: 'SD' },
  { nama: 'SD NEGERI 4 SIGONG', npsn: '20244513', status: 'NEGERI', address: 'Jl. Cantilan, Sigong', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 SINDANGLAUT', npsn: '20215464', status: 'NEGERI', address: 'Jl. Arief Rahman Hakim No. 24, Sindanglaut', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 TUK KARANGSUWUNG', npsn: '20246445', status: 'NEGERI', address: 'Jl. Pulo Undrus Ujung, Tuk Karangsuwung', jenjang: 'SD' },
  { nama: 'SD NEGERI 1 WANGKELANG', npsn: '20215584', status: 'NEGERI', address: 'Jl. Raya Wangkelang No. 40, Wangkelang', jenjang: 'SD' },
  { nama: 'SD IT AL IRSYAD AL ISLAMIYYAH', npsn: '20215221', status: 'SWASTA', address: 'Jl. Syech Lemahabang No. 54, Lemahabang Kulon', jenjang: 'SD' },
  // TK (8)
  { nama: 'TK NEGERI LEMAHABANG', npsn: '20270605', status: 'NEGERI', address: 'Jl. KH. Wakhid Hasyim, Cipeujeuh Wetan', jenjang: 'TK' },
  { nama: 'TK AISYIYAH LEMAHABANG', npsn: '20254372', status: 'SWASTA', address: 'Jl. Ki Hajar Dewantoro No. 25, Lemahabang', jenjang: 'TK' },
  { nama: 'TK AL-AQSO', npsn: '20254376', status: 'SWASTA', address: 'Jl. Desa Tuk Karangsuwung, Tuk Karangsuwung', jenjang: 'TK' },
  { nama: 'TK AL-IRSYAD AL-ISLAMIYYAH', npsn: '20254373', status: 'SWASTA', address: 'Jl. Syekh Lemahabang No. 54, Lemahabang Kulon', jenjang: 'TK' },
  { nama: 'TK BPP KENANGA', npsn: '20254374', status: 'SWASTA', address: 'Jl. Abdurahman Saleh No. 24, Asem', jenjang: 'TK' },
  { nama: 'TK GELATIK', npsn: '20254370', status: 'SWASTA', address: 'Jl. Raya Dr. Wahidin No. 57A, Cipeujeuh Wetan', jenjang: 'TK' },
  { nama: 'TK MELATI', npsn: '20254378', status: 'SWASTA', address: 'Jl. Desa Wangkelang, Wangkelang', jenjang: 'TK' },
  { nama: 'TK MUSLIMAT NU', npsn: '20254375', status: 'SWASTA', address: 'Jl. R.A. Kartini No. 5, Lemahabang', jenjang: 'TK' },
  // KB/PAUD (15)
  { nama: 'KB A.H. PLUS', npsn: '70039880', status: 'SWASTA', address: 'Jl. Pelita Dusun 4, Sigong', jenjang: 'KB' },
  { nama: 'KB AMALIA SALSABILA', npsn: '69804039', status: 'SWASTA', address: 'Jl. K.H. Hasyim Asyari No. 112, Cipeujeuh Kulon', jenjang: 'KB' },
  { nama: 'KB AZ-ZAHRA', npsn: '69804068', status: 'SWASTA', address: 'Jl. Pelita Dusun 02, Sigong', jenjang: 'KB' },
  { nama: 'KB MUTIARA', npsn: '70044538', status: 'SWASTA', address: 'Jl. KH. Hasyim Asyari No. 48, Cipeujeuh Wetan', jenjang: 'KB' },
  { nama: 'KB PALAPA', npsn: '69870486', status: 'SWASTA', address: 'Jl. Syech Lemahabang, Lemahabang Kulon', jenjang: 'KB' },
  { nama: 'KB PERMATA BUNDA', npsn: '70024652', status: 'SWASTA', address: 'Jl. Palasah Nunggal, Picungpugur', jenjang: 'KB' },
  { nama: 'PAUD AL HAMBRA', npsn: '69947715', status: 'SWASTA', address: 'Desa Lemahabang, Lemahabang', jenjang: 'KB' },
  { nama: 'PAUD AL-HIDAYAH', npsn: '69870488', status: 'SWASTA', address: 'Jl. Cantilan, Sigong', jenjang: 'KB' },
  { nama: 'PAUD AL-HUSNA', npsn: '69870479', status: 'SWASTA', address: 'Jl. Mbah Ardisela Desa Asem, Asem', jenjang: 'KB' },
  { nama: 'PAUD AMANAH', npsn: '69870482', status: 'SWASTA', address: 'Jl. Sidaresmi No. 1, Lemahabang Kulon', jenjang: 'KB' },
  { nama: 'PAUD AN NAIM', npsn: '69870484', status: 'SWASTA', address: 'Blok Kliwon, Sindanglaut', jenjang: 'KB' },
  { nama: 'PAUD ASY-SYAFIIYAH', npsn: '69870485', status: 'SWASTA', address: 'Jl. Stasiun No. 15, Lemahabang Kulon', jenjang: 'KB' },
  { nama: 'PAUD BUDGENVIL', npsn: '69870489', status: 'SWASTA', address: 'Jl. Inpres, Belawa', jenjang: 'KB' },
  { nama: 'PAUD TUNAS HARAPAN', npsn: '69870490', status: 'SWASTA', address: 'Blok Pahing, Wangkelang', jenjang: 'KB' },
  { nama: 'PAUD SPS MELATI', npsn: '69804044', status: 'SWASTA', address: 'Dusun 02, Sarajaya', jenjang: 'KB' },
];

function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

// ── Column helpers ──
const SD_GRADE_COLS = { "1": "sd_g1", "2": "sd_g2", "3": "sd_g3", "4": "sd_g4", "5": "sd_g5", "6": "sd_g6" };
const PROM_COLS = {
  "1": ["sd_1_to_2_l", "sd_1_to_2_p"], "2": ["sd_2_to_3_l", "sd_2_to_3_p"],
  "3": ["sd_3_to_4_l", "sd_3_to_4_p"], "4": ["sd_4_to_5_l", "sd_4_to_5_p"],
  "5": ["sd_5_to_6_l", "sd_5_to_6_p"],
};
const TK_GRADE_COLS = { "A": "tk_a", "B": "tk_b" };
const KB_GRADE_COLS = { "PLAY": "kb_play", "CONT": "kb_cont" };

function getLevelLabel(level) {
  if (level === "SD") return "SD";
  if (level === "TK") return "TK";
  return "KB";
}

// ── Parse kelas & rombel to extract grade info ──
function parseGrade(kelasStr, rombelStr, level) {
  if (level === "SD") {
    const m = String(kelasStr).match(/(\d)/);
    return m ? m[1] : null;
  }
  if (level === "TK") {
    const r = (rombelStr || "").toUpperCase();
    if (r.includes("A")) return "A";
    if (r.includes("B")) return "B";
    return "A"; // default
  }
  if (level === "KB") {
    const r = (rombelStr || "").toUpperCase();
    if (r.includes("PLAY") || r.includes("PG") || r.includes("A")) return "PLAY";
    return "CONT";
  }
  return null;
}

async function main() {
  try {
    const now = new Date().toISOString();

    // Load data
    const pegawaiSDTK = readJSON(path.join(BASE, "data-pegawai.json"));
    const pegawaiTK = readJSON(path.join(BASE, "data-pegawai-tk.json"));
    const semuaPegawai = [...pegawaiSDTK, ...pegawaiTK];
    const semuaSiswa = readJSON(path.join(BASE, "data-siswa.json"));

    console.log(`Loaded: ${ALL_SCHOOLS.length} schools, ${semuaPegawai.length} pegawai, ${semuaSiswa.length} siswa`);

    // ── 1. Hapus data existing ──
    const tables = [
      "non_continuing_students", "continuing_students", "alumni",
      "class_groups", "student_promotions", "student_admissions",
      "users", "schools",
    ];
    for (const t of tables) {
      await client.execute(`DELETE FROM ${t}`);
    }
    console.log("Cleared all tables");

    // ── 2. Import sekolah ──
    const schoolMap = {}; // npsn → id
    const schoolNamaMap = {}; // nama → id
    const canonicalAliases = {}; // alias → canonical name

    // Load canonical name mapping
    const canonicalRaw = fs.readFileSync(path.join(BASE, "canonical-schools.json"), "utf8");
    const canonical = JSON.parse(canonicalRaw.replace(/^\uFEFF/, ""));
    for (const [level, schools] of Object.entries(canonical)) {
      for (const [canonicalName, aliases] of Object.entries(schools)) {
        for (const alias of aliases) {
          canonicalAliases[alias.toLowerCase().trim()] = canonicalName;
        }
      }
    }

    for (const s of ALL_SCHOOLS) {
      const level = s.jenjang;
      const id = `${getLevelLabel(level)}_${s.npsn}`;
      await client.execute({
        sql: `INSERT INTO schools (id, npsn, name, level, address, status, created_at, updated_at, created_by)
              VALUES (?, ?, ?, ?, ?, 'VALID', ?, ?, 'import')`,
        args: [id, s.npsn, s.nama, level, s.address || "", now, now],
      });
      schoolMap[s.npsn] = id;
      schoolNamaMap[s.nama.toLowerCase()] = id;
    }
    console.log(`Imported ${ALL_SCHOOLS.length} schools`);

    // ── 3. Import pegawai → users ──
    let importedPegawai = 0;
    const usedUsernames = new Set();
    for (const p of semuaPegawai) {
      let schoolId = null;
      const sekolahName = (p.sekolah || "").trim();
      if (sekolahName) {
        const canon = canonicalAliases[sekolahName.toLowerCase()];
        const lookup = canon ? canon.toLowerCase() : sekolahName.toLowerCase();
        schoolId = schoolNamaMap[lookup] || schoolNamaMap[canon?.toLowerCase()] || null;
      }

      const id = `peg_${String(importedPegawai).padStart(4, "0")}`;
      let username = p.nik ? `nik_${p.nik}` : `peg_${importedPegawai}`;
      while (usedUsernames.has(username)) {
        username = username + "_" + Math.random().toString(36).slice(2, 6);
      }
      usedUsernames.add(username);
      const role = "PUBLIK";
      const name = (p.nama || "").trim() || username;

      await client.execute({
        sql: `INSERT INTO users (id, username, name, role, school_id, created_at, updated_at, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'import')`,
        args: [id, username, name, role, schoolId, now, now],
      });
      importedPegawai++;
    }
    console.log(`Imported ${importedPegawai} users`);

    // ── 4. Aggregasi siswa per sekolah ──
    const counts = {}; // key: "npsn_kelas_jk"
    const rombelSet = {}; // key: "npsn_kelas" (or npsn_grade for TK/KB)

    for (const siswa of semuaSiswa) {
      const npsn = siswa.npsn;
      if (!schoolMap[npsn]) {
        console.warn(`Skipping siswa ${siswa.nama} - unknown NPSN: ${npsn}`);
        continue;
      }

      const school = ALL_SCHOOLS.find(s => s.npsn === npsn);
      const level = school ? school.jenjang : "SD";
      const jk = siswa.jk === "L" ? "l" : "p";
      const grade = parseGrade(siswa.kelas, siswa.rombel, level);
      if (!grade) continue;

      const key = `${npsn}_${grade}_${jk}`;
      counts[key] = (counts[key] || 0) + 1;

      if (siswa.rombel && siswa.rombel.trim()) {
        const rombelKey = `${npsn}_${grade}`;
        if (!rombelSet[rombelKey]) rombelSet[rombelKey] = {};
        rombelSet[rombelKey][siswa.rombel.trim().toUpperCase()] = true;
      }
    }

    // ── 5. Insert class_groups ──
    for (const [rombelKey, rombels] of Object.entries(rombelSet)) {
      const parts = rombelKey.split("_");
      const npsn = parts[0];
      const grade = parts.slice(1).join("_");
      const schoolId = schoolMap[npsn];
      if (!schoolId) continue;

      const school = ALL_SCHOOLS.find(s => s.npsn === npsn);
      const level = school ? school.jenjang : "SD";
      let col = null;

      if (level === "SD") {
        col = SD_GRADE_COLS[grade];
      } else if (level === "TK") {
        col = TK_GRADE_COLS[grade];
      } else if (level === "KB") {
        col = KB_GRADE_COLS[grade];
      }
      if (!col) continue;

      let rombelCount = Object.keys(rombels).length;
      if (rombelCount === 1) {
        const total = (counts[`${npsn}_${grade}_l`] || 0) + (counts[`${npsn}_${grade}_p`] || 0);
        rombelCount = Math.max(1, Math.ceil(total / 28));
      }

      const id = `cg_${schoolId}_${grade}_2026`;
      try {
        await client.execute({
          sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                VALUES (?, ?, '2026/2027', ?, ?, ?, 'import')`,
          args: [id, schoolId, rombelCount, now, now],
        });
      } catch (e) {
        if (!e.message.includes("UNIQUE constraint")) throw e;
      }
    }

    // Fill missing grades per school
    for (const s of ALL_SCHOOLS) {
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      const level = s.jenjang;
      let grades = [];

      if (level === "SD") {
        for (let g = 1; g <= 6; g++) {
          const col = SD_GRADE_COLS[String(g)];
          const rombelKey = `${npsn}_${g}`;
          if (!rombelSet[rombelKey]) {
            const total = (counts[`${npsn}_${g}_l`] || 0) + (counts[`${npsn}_${g}_p`] || 0);
            if (total > 0) {
              const estRombel = Math.max(1, Math.ceil(total / 28));
              try {
                await client.execute({
                  sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                        VALUES (?, ?, '2026/2027', ?, ?, ?, 'import')`,
                  args: [`cg_${schoolId}_${g}_2026`, schoolId, estRombel, now, now],
                });
              } catch (e) {
                if (!e.message.includes("UNIQUE constraint")) throw e;
              }
            }
          }
        }
      } else if (level === "TK") {
        for (const [g, col] of Object.entries(TK_GRADE_COLS)) {
          const total = (counts[`${npsn}_${g}_l`] || 0) + (counts[`${npsn}_${g}_p`] || 0);
          if (total > 0) {
            const estRombel = Math.max(1, Math.ceil(total / 20));
            try {
              await client.execute({
                sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                      VALUES (?, ?, '2026/2027', ?, ?, ?, 'import')`,
                args: [`cg_${schoolId}_${g}_2026`, schoolId, estRombel, now, now],
              });
            } catch (e) {
              if (!e.message.includes("UNIQUE constraint")) throw e;
            }
          }
        }
      } else if (level === "KB") {
        for (const [g, col] of Object.entries(KB_GRADE_COLS)) {
          const total = (counts[`${npsn}_${g}_l`] || 0) + (counts[`${npsn}_${g}_p`] || 0);
          if (total > 0) {
            const estRombel = Math.max(1, Math.ceil(total / 15));
            try {
              await client.execute({
                sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                      VALUES (?, ?, '2026/2027', ?, ?, ?, 'import')`,
                args: [`cg_${schoolId}_${g}_2026`, schoolId, estRombel, now, now],
              });
            } catch (e) {
              if (!e.message.includes("UNIQUE constraint")) throw e;
            }
          }
        }
      }
    }
    console.log("Imported class_groups");

    // ── 6. Insert student_promotions (SD only) ──
    for (const s of ALL_SCHOOLS) {
      if (s.jenjang !== "SD") continue;
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      const cols = [];
      const vals = [];

      for (let g = 1; g <= 5; g++) {
        const l = counts[`${npsn}_${g}_l`] || 0;
        const p = counts[`${npsn}_${g}_p`] || 0;
        const [colL, colP] = PROM_COLS[String(g)];
        cols.push(colL, colP);
        vals.push(l, p);
      }

      const hasData = vals.some(v => v > 0);
      if (hasData) {
        const placeholders = cols.map(() => "?").join(", ");
        await client.execute({
          sql: `INSERT INTO student_promotions (id, school_id, year, ${cols.join(", ")}, created_at, updated_at, created_by)
                VALUES (?, ?, '2026/2027', ${placeholders}, ?, ?, 'import')`,
          args: [`sp_${schoolId}_2026`, schoolId, ...vals, now, now],
        });
      }
    }
    console.log("Imported student_promotions");

    // ── 7. Insert admissions (kelas 1 SD, kelas A TK, kelas PLAY KB) ──
    for (const s of ALL_SCHOOLS) {
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      let l = 0, p = 0;

      if (s.jenjang === "SD") {
        l = counts[`${npsn}_1_l`] || 0;
        p = counts[`${npsn}_1_p`] || 0;
      } else if (s.jenjang === "TK") {
        l = counts[`${npsn}_A_l`] || 0;
        p = counts[`${npsn}_A_p`] || 0;
      } else if (s.jenjang === "KB") {
        l = counts[`${npsn}_PLAY_l`] || 0;
        p = counts[`${npsn}_PLAY_p`] || 0;
      }

      if (l + p > 0) {
        await client.execute({
          sql: `INSERT INTO student_admissions (id, school_id, year, domisili_l, domisili_p, afirmasi_l, afirmasi_p, mutasi_l, mutasi_p, created_at, updated_at, created_by)
                VALUES (?, ?, '2026/2027', ?, ?, 0, 0, 0, 0, ?, ?, 'import')`,
          args: [`sa_${schoolId}_2026`, schoolId, l, p, now, now],
        });
      }
    }
    console.log("Imported student_admissions");

    // ── 8. Alumni & continuing (SD kelas 6, TK kelas B, KB CONT) ──
    for (const s of ALL_SCHOOLS) {
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      let l = 0, p = 0;

      if (s.jenjang === "SD") {
        l = counts[`${npsn}_6_l`] || 0;
        p = counts[`${npsn}_6_p`] || 0;
      } else if (s.jenjang === "TK") {
        l = counts[`${npsn}_B_l`] || 0;
        p = counts[`${npsn}_B_p`] || 0;
      } else if (s.jenjang === "KB") {
        l = counts[`${npsn}_CONT_l`] || 0;
        p = counts[`${npsn}_CONT_p`] || 0;
      }

      if (l + p > 0) {
        await client.execute({
          sql: `INSERT INTO alumni (id, school_id, year, l, p, created_at, updated_at, created_by)
                VALUES (?, ?, '2025/2026', ?, ?, ?, ?, 'import')`,
          args: [`al_${schoolId}_2025`, schoolId, l, p, now, now],
        });
        await client.execute({
          sql: `INSERT INTO continuing_students (id, school_id, year, l, p, created_at, updated_at, created_by)
                VALUES (?, ?, '2026/2027', ?, ?, ?, ?, 'import')`,
          args: [`cs_${schoolId}_2026`, schoolId, l, p, now, now],
        });
        await client.execute({
          sql: `INSERT INTO non_continuing_students (id, school_id, year, l, p, created_at, updated_at, created_by)
                VALUES (?, ?, '2026/2027', 0, 0, ?, ?, 'import')`,
          args: [`nc_${schoolId}_2026`, schoolId, now, now],
        });
      }
    }
    console.log("Imported alumni and continuing/non-continuing students");

    console.log("\n=== Import selesai! ===");
    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    console.error(e);
    process.exit(1);
  }
}

main();
