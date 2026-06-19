const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function generateId(label, npsn) {
  return `${label}_${npsn}`;
}

async function main() {
  try {
    function readJSON(filePath) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw.replace(/^\uFEFF/, ""));
    }
    const sekolahData = readJSON("C:\\Users\\Bank Yan\\portal-dinas\\data_mix\\data-sekolah.json");
    const pegawaiData = readJSON("C:\\Users\\Bank Yan\\portal-dinas\\data_mix\\data-pegawai.json");
    const siswaData = readJSON("C:\\Users\\Bank Yan\\portal-dinas\\data_mix\\data-siswa.json");

    const now = new Date().toISOString();
    const batchSize = 50;

    console.log(`Loaded: ${sekolahData.length} schools, ${pegawaiData.length} pegawai, ${siswaData.length} siswa`);

    // ── 1. Hapus data existing ──
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
      await client.execute(`DELETE FROM ${t}`);
      console.log(`Cleared ${t}`);
    }

    // ── 2. Import sekolah ──
    const schoolMap = {}; // npsn → school id
    const sekolahNamaMap = {}; // nama → school id

    for (const s of sekolahData) {
      const level = s.jenjang || "SD";
      const id = generateId(level === "TK" ? "TK" : level === "KB" ? "KB" : "SD", s.npsn);
      await client.execute({
        sql: `INSERT INTO schools (id, npsn, name, level, address, status, created_at, updated_at, created_by)
              VALUES (?, ?, ?, ?, ?, 'VALID', ?, ?, 'import')`,
        args: [id, s.npsn, s.nama, level, s.address || "", now, now],
      });
      schoolMap[s.npsn] = id;
      sekolahNamaMap[s.nama.toLowerCase()] = id;
    }
    console.log(`Imported ${sekolahData.length} schools`);

    // Build name→id map for pegawai (nama matches langsung)
    // For siswa: "NEGERI 1 ASEM KECAMATAN LEMAHABANG" → cari "SD NEGERI 1 ASEM"
    function findSchoolIdBySiswaName(siswaNama) {
      // Format siswa: "NEGERI 1 ASEM KECAMATAN LEMAHABANG" atau "NEGERI LEMAHABANG"
      const normalized = siswaNama.toLowerCase().replace(/kecamatan\s+\S+/, "").trim();
      // Cari cocokan partial di nama sekolah
      for (const [nama, id] of Object.entries(sekolahNamaMap)) {
        if (nama.includes(normalized) || normalized.includes(nama.replace(/^(sd|tk|kb)\s+/, ""))) {
          return id;
        }
      }
      return null;
    }

    // ── 3. Import pegawai → users ──
    let importedPegawai = 0;
    const usedUsernames = new Set();
    for (const p of pegawaiData) {
      const schoolId = sekolahNamaMap[p.sekolah.toLowerCase()] || null;
      const id = `peg_${String(importedPegawai).padStart(4, "0")}`;
      let username = p.nik ? `nik_${p.nik}` : `peg_${slug(p.nama)}_${importedPegawai}`;
      while (usedUsernames.has(username)) {
        username = username + "_" + Math.random().toString(36).slice(2, 6);
      }
      usedUsernames.add(username);
      const role = p.role === "kepala_sekolah" || p.role === "operator" ? "OPERATOR" : "PUBLIK";
      const name = (p.nama || "").trim() || username;

      await client.execute({
        sql: `INSERT INTO users (id, username, name, role, school_id, created_at, updated_at, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'import')`,
        args: [id, username, name, role, schoolId, now, now],
      });
      importedPegawai++;
    }
    console.log(`Imported ${importedPegawai} users`);

    // ── 4. Aggregasi siswa per sekolah/kelas/jk ──
    const counts = {}; // key: "npsn_kelas_jk"
    const rombelSet = {}; // key: "npsn_kelas", value: { rombelName: true }

    for (const siswa of siswaData) {
      const schoolId = schoolMap[siswa.npsn] || findSchoolIdBySiswaName(siswa.sekolah);
      if (!schoolId) {
        console.warn(`Skipping siswa ${siswa.nama} - unknown school: ${siswa.sekolah} (npsn: ${siswa.npsn})`);
        continue;
      }

      const npsn = siswa.npsn;
      const kelas = String(siswa.kelas);
      const jk = siswa.jk === "L" ? "l" : "p";
      const key = `${npsn}_${kelas}_${jk}`;
      counts[key] = (counts[key] || 0) + 1;

      if (siswa.rombel && siswa.rombel.trim()) {
        const rombelKey = `${npsn}_${kelas}`;
        if (!rombelSet[rombelKey]) rombelSet[rombelKey] = {};
        rombelSet[rombelKey][siswa.rombel.trim()] = true;
      }
    }

    // ── 5. Insert class_groups ──
    const gradeToColumn = {
      "1": "sd_g1", "2": "sd_g2", "3": "sd_g3",
      "4": "sd_g4", "5": "sd_g5", "6": "sd_g6",
    };

    for (const [rombelKey, rombels] of Object.entries(rombelSet)) {
      const parts = rombelKey.split("_");
      const npsn = parts[0];
      const kelas = parts[1];
      const schoolId = schoolMap[npsn];
      if (!schoolId) continue;
      const col = gradeToColumn[kelas];
      if (!col) continue;

      let rombelCount = Object.keys(rombels).length;
      if (rombelCount === 1 && Object.keys(rombels)[0].match(/^[1-6]$/)) {
        const total = (counts[`${npsn}_${kelas}_l`] || 0) + (counts[`${npsn}_${kelas}_p`] || 0);
        rombelCount = Math.max(1, Math.ceil(total / 28));
      }

      await client.execute({
        sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
              VALUES (?, ?, '2026/2027', ?, ?, ?, 'import')`,
        args: [`cg_${schoolId}_${kelas}_2026`, schoolId, rombelCount, now, now],
      });
    }

    for (const s of sekolahData) {
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      for (let g = 1; g <= 6; g++) {
        const col = gradeToColumn[String(g)];
        const rombelKey = `${npsn}_${g}`;
        if (!rombelSet[rombelKey]) {
          const total = (counts[`${npsn}_${g}_l`] || 0) + (counts[`${npsn}_${g}_p`] || 0);
          if (total > 0) {
            const estRombel = Math.max(1, Math.ceil(total / 28));
            await client.execute({
              sql: `INSERT INTO class_groups (id, school_id, year, ${col}, created_at, updated_at, created_by)
                    VALUES (?, ?, '2026/2027', ?, ?, ?, 'import')`,
              args: [`cg_${schoolId}_${g}_2026`, schoolId, estRombel, now, now],
            });
          }
        }
      }
    }
    console.log("Imported class_groups");

    // ── 6. Insert student_promotions ──
    const promCols = {
      "1": ["sd_1_to_2_l", "sd_1_to_2_p"],
      "2": ["sd_2_to_3_l", "sd_2_to_3_p"],
      "3": ["sd_3_to_4_l", "sd_3_to_4_p"],
      "4": ["sd_4_to_5_l", "sd_4_to_5_p"],
      "5": ["sd_5_to_6_l", "sd_5_to_6_p"],
    };

    for (const s of sekolahData) {
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      const cols = [];
      const vals = [];

      for (let g = 1; g <= 5; g++) {
        const l = counts[`${npsn}_${g}_l`] || 0;
        const p = counts[`${npsn}_${g}_p`] || 0;
        const [colL, colP] = promCols[String(g)];
        cols.push(colL, colP);
        vals.push(l, p);
      }

      const hasData = vals.some((v) => v > 0);
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

    // ── 7. Insert student_admissions (kelas 1 students) ──
    for (const s of sekolahData) {
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      const l = counts[`${npsn}_1_l`] || 0;
      const p = counts[`${npsn}_1_p`] || 0;
      if (l + p > 0) {
        await client.execute({
          sql: `INSERT INTO student_admissions (id, school_id, year, domisili_l, domisili_p, afirmasi_l, afirmasi_p, mutasi_l, mutasi_p, created_at, updated_at, created_by)
                VALUES (?, ?, '2026/2027', ?, ?, 0, 0, 0, 0, ?, ?, 'import')`,
          args: [`sa_${schoolId}_2026`, schoolId, l, p, now, now],
        });
      }
    }
    console.log("Imported student_admissions");

    // ── 8. Insert alumni and continuing/non-continuing (kelas 6) ──
    for (const s of sekolahData) {
      const schoolId = schoolMap[s.npsn];
      const npsn = s.npsn;
      const l = counts[`${npsn}_6_l`] || 0;
      const p = counts[`${npsn}_6_p`] || 0;
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

    console.log("\nImport selesai!");
    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    console.error(e);
    process.exit(1);
  }
}

main();
