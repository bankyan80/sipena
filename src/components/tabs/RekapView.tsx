import React, { useState } from "react";
import { useApp } from "../../AppContext";
import {
  FileText,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  School,
  GraduationCap,
  Building,
  AlertCircle,
  HelpCircle,
  Download,
} from "lucide-react";
import { SchoolLevel } from "../../types";

export const RekapView: React.FC = () => {
  const { state, toggleSchoolValidation, triggerNotification } = useApp();
  const [levelFilter, setLevelFilter] = useState<SchoolLevel | "all">("all");
  const [exportPreviewData, setExportPreviewData] = useState<string | null>(null);

  const user = state.currentUser;
  const isAdmin = user?.role === "ADMIN";

  // Filter schools list
  const filteredSchools = state.schools.filter((s) => {
    return levelFilter === "all" || s.level === levelFilter;
  });

  // Calculate high-level cumulative statistics for the summary panel
  const totalVerified = filteredSchools.filter((s) => s.status === "VALID").length;
  const totalPending = filteredSchools.filter((s) => s.status === "PENDING").length;

  // Real CSV compiler for download
  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID Sekolah,Nama Sekolah,Jenjang,Alamat,Status Validasi,Siswa Baru (L),Siswa Baru (P),Siswa Baru (Total),Rombel SD,Rombel TK,Rombel KB,Alumni,Melanjutkan,Tidak Melanjutkan\n";

    filteredSchools.forEach((sch) => {
      // Fetch school's data
      const adm = state.studentAdmissions.find((x) => x.schoolId === sch.id) || {
        domisili: { l: 0, p: 0 }, afirmasi: { l: 0, p: 0 }, mutasi: { l: 0, p: 0 }
      };
      const admL = adm.domisili.l + adm.afirmasi.l + adm.mutasi.l;
      const admP = adm.domisili.p + adm.afirmasi.p + adm.mutasi.p;
      const admTotal = admL + admP;

      const rom = state.classGroups.find((x) => x.schoolId === sch.id) || {
        sd_g1: 0, sd_g2: 0, sd_g3: 0, sd_g4: 0, sd_g5: 0, sd_g6: 0,
        tk_a: 0, tk_b: 0, kb_play: 0, kb_cont: 0
      };
      const romSD = rom.sd_g1 + rom.sd_g2 + rom.sd_g3 + rom.sd_g4 + rom.sd_g5 + rom.sd_g6;
      const romTK = rom.tk_a + rom.tk_b;
      const romKB = rom.kb_play + rom.kb_cont;

      const al = state.alumni.find((x) => x.schoolId === sch.id) || { l: 0, p: 0 };
      const alTotal = al.l + al.p;

      const cont = state.continuingStudents.find((x) => x.schoolId === sch.id) || { l: 0, p: 0 };
      const non = state.nonContinuingStudents.find((x) => x.schoolId === sch.id) || { l: 0, p: 0 };

      const sanitizeCsv = (val: string | number) => {
        const s = String(val);
        return /^[=+\-@]/.test(s) ? `"'${s}"` : `"${s}"`;
      };

      const row = [
        sanitizeCsv(sch.id),
        sanitizeCsv(sch.name),
        sanitizeCsv(sch.level),
        sanitizeCsv(sch.address),
        sanitizeCsv(sch.status),
        admL,
        admP,
        admTotal,
        romSD,
        romTK,
        romKB,
        alTotal,
        cont.l + cont.p,
        non.l + non.p
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SIPENA_Rekap_2026_2027_${levelFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerNotification(`Rekap Excel / CSV jenjang "${levelFilter}" berhasil diunduh.`);
  };

  const handleExportPDF = () => {
    // Generate simple styled print-ready page
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocker menghalangi pembukaan cetak laporan! Izinkan popups.");
      return;
    }

    const schoolsRows = filteredSchools.map((sch) => {
      const adm = state.studentAdmissions.find((x) => x.schoolId === sch.id) || {
        domisili: { l: 0, p: 0 }, afirmasi: { l: 0, p: 0 }, mutasi: { l: 0, p: 0 }
      };
      const admL = adm.domisili.l + adm.afirmasi.l + adm.mutasi.l;
      const admP = adm.domisili.p + adm.afirmasi.p + adm.mutasi.p;
      
      const rom = state.classGroups.find((x) => x.schoolId === sch.id) || {
        sd_g1: 0, sd_g2: 0, sd_g3: 0, sd_g4: 0, sd_g5: 0, sd_g6: 0,
        tk_a: 0, tk_b: 0, kb_play: 0, kb_cont: 0
      };
      const totalRom = rom.sd_g1 + rom.sd_g2 + rom.sd_g3 + rom.sd_g4 + rom.sd_g5 + rom.sd_g6 + rom.tk_a + rom.tk_b + rom.kb_play + rom.kb_cont;

      const al = state.alumni.find((x) => x.schoolId === sch.id) || { l: 0, p: 0 };
      const cont = state.continuingStudents.find((x) => x.schoolId === sch.id) || { l: 0, p: 0 };
      const non = state.nonContinuingStudents.find((x) => x.schoolId === sch.id) || { l: 0, p: 0 };

      return `
        <tr>
          <td>${sch.id}</td>
          <td><b>${sch.name}</b><br><small>${sch.address}</small></td>
          <td align="center">${sch.level}</td>
          <td align="center">${admL} L / ${admP} P (<b>${admL + admP}</b>)</td>
          <td align="center">${totalRom}</td>
          <td align="center">${al.l + al.p}</td>
          <td align="center" style="color: green; font-weight: bold;">${cont.l + cont.p}</td>
          <td align="center" style="color: red; font-weight: bold;">${non.l + non.p}</td>
          <td align="center">
            <span style="background: ${sch.status === 'VALID' ? '#DEF7EC' : '#FEF08A'}; color: ${sch.status === 'VALID' ? '#03543F' : '#713F12'}; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; border: 1px solid ${sch.status === 'VALID' ? '#bbf7d0' : '#fef08a'};">
              ${sch.status}
            </span>
          </td>
        </tr>
      `;
    }).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>SIPENA Laporan Resmi Kecamatan 2026/2027</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 30px; line-height: 1.4; }
            .header { text-align: center; border-bottom: 3px double #0F3D91; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { color: #0F3D91; margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 11px; color: #555; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background-color: #0F3D91; color: white; padding: 10px; text-align: left; text-transform: uppercase; }
            td { padding: 10px; border-bottom: 1px solid #E2E8F0; }
            tr:nth-child(even) { background-color: #F8FAFC; }
            .footer { text-align: center; margin-top: 40px; font-size: 9px; color: #999; border-top: 1px solid #CBD5E1; padding-top: 15px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SISTEM INFORMASI PENDATAAN SISWA (SIPENA)</h1>
            <p>KOMPILASI LAPORAN REKAP DATA TP 2026/2027 - JENJANG GABUNGAN</p>
          </div>
          <div class="meta">
            <div>Dibuat Pada: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}</div>
            <div>Oleh: ${isAdmin ? "Kecamatan Administrator" : "Peninjau Publik"}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Sekolah & Alamat</th>
                <th>Jenjang</th>
                <th>Siswa Baru (L/P/Tot)</th>
                <th>Rombel</th>
                <th>Alumni</th>
                <th>Lanjut</th>
                <th>Tdk Lanjut</th>
                <th>Validasi</th>
              </tr>
            </thead>
            <tbody>
              ${schoolsRows}
            </tbody>
          </table>
          <div class="footer">
            Satu Data Siswa, Satu Arah Perencanaan Pendidikan. Diproduksi secara resmi oleh Dinas Pendidikan Kecamatan Utama.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    triggerNotification("Laporan resmi PDF ditarik ke tab cetak printer.");
  };

  return (
    <div className="space-y-4 px-4 pt-4 pb-24 max-w-md mx-auto">
      {/* 1. Summary card */}
      <div className="bg-white p-4 rounded-[20px] shadow-soft border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-[#0F3D91] rounded-xl">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#0F3D91] uppercase tracking-wider">
              Rekap Kompilasi Sekolah
            </h3>
            <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
              SD; TK; dan KB Terdaftar
            </span>
          </div>
        </div>

        <div className="flex gap-2 text-right">
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-center">
            <p className="text-[8px] font-bold">VALID</p>
            <strong className="text-xs">{totalVerified}</strong>
          </div>
          <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-center">
            <p className="text-[8px] font-bold">PENDING</p>
            <strong className="text-xs">{totalPending}</strong>
          </div>
        </div>
      </div>

      {/* 2. Top Controls Filters */}
      <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between gap-3">
        {/* Quick level change */}
        <div className="flex gap-1.5 flex-1">
          {(["all", "SD", "TK", "KB"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all capitalize cursor-pointer ${
                levelFilter === lvl
                  ? "bg-[#0F3D91] text-white"
                  : "bg-gray-50 text-gray-400 border hover:bg-gray-100"
              }`}
            >
              {lvl === "all" ? "Semua" : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Export Operations - visible if admin or selected */}
      <div className="bg-amber-50/50 border border-amber-200/40 p-4 rounded-[20px] space-y-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={15} className="text-[#F97316] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">
              {isAdmin ? "Kewenangan Admin Kecamatan" : "Apresiasi Ekspor Rekap"}
            </h4>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
              {isAdmin 
                ? "Dapatkan data rekap legalisir format spreadsheet Excel atau cetak lembar PDF instan."
                : "Unduh laporan gabungan SD/TK/KB se-Kecamatan secara instan."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Excel export */}
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <FileSpreadsheet size={16} /> Excel / CSV
          </button>

          {/* PDF export */}
          <button
            onClick={handleExportPDF}
            className="bg-[#0F3D91] hover:bg-[#0c3276] text-white h-11 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Printer size={16} /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* 4. Filtered school list items */}
      <div className="space-y-3">
        <h4 className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">
          Daftar Lembaga Terdaftar ({filteredSchools.length})
        </h4>

        <div className="space-y-3">
          {filteredSchools.map((sch) => {
            // Numbers preview
            const adm = state.studentAdmissions.find((x) => x.schoolId === sch.id) || {
              domisili: { l: 0, p: 0 }, afirmasi: { l: 0, p: 0 }, mutasi: { l: 0, p: 0 }
            };
            const admTotal = adm.domisili.l + adm.domisili.p + adm.afirmasi.l + adm.afirmasi.p + adm.mutasi.l + adm.mutasi.p;

            const rom = state.classGroups.find((x) => x.schoolId === sch.id) || {
              sd_g1: 0, sd_g2: 0, sd_g3: 0, sd_g4: 0, sd_g5: 0, sd_g6: 0,
              tk_a: 0, tk_b: 0, kb_play: 0, kb_cont: 0
            };
            const romTotal = rom.sd_g1 + rom.sd_g2 + rom.sd_g3 + rom.sd_g4 + rom.sd_g5 + rom.sd_g6 + rom.tk_a + rom.tk_b + rom.kb_play + rom.kb_cont;

            const al = state.alumni.find((x) => x.schoolId === sch.id) || { l: 0, p: 0 };
            const isVerified = sch.status === "VALID";

            return (
              <div
                key={sch.id}
                className="bg-white p-4 rounded-[20px] shadow-soft border border-gray-100 flex flex-col gap-3 relative overflow-hidden"
              >
                {/* School level color ribbon */}
                <span
                  style={{
                    backgroundColor:
                      sch.level === "SD" ? "#0F3D91" : sch.level === "TK" ? "#22C55E" : "#F97316"
                  }}
                  className="absolute top-0 left-0 w-1.5 h-full"
                />

                <div className="flex justify-between items-start pl-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Kode: {sch.id} • Jenjang {sch.level}
                    </span>
                    <h5 className="text-xs font-bold text-gray-800 leading-tight">
                      {sch.name}
                    </h5>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{sch.address}</p>
                  </div>

                  {/* Status Indicator bubble */}
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                      isVerified
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-[#F97316] border-amber-100"
                    }`}
                  >
                    {sch.status}
                  </span>
                </div>

                {/* Grid stats preview */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50/50 p-2 rounded-xl text-center pl-2 font-bold select-none text-gray-50 decision">
                  <div>
                    <p className="text-[8px] text-gray-400">Siswa Baru</p>
                    <p className="text-xs text-gray-800 font-extrabold">{admTotal}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400">Rombel</p>
                    <p className="text-xs text-gray-800 font-extrabold">{romTotal}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400">Alumni</p>
                    <p className="text-xs text-gray-800 font-extrabold">{al.l + al.p}</p>
                  </div>
                </div>

                {/* Validation and interaction triggers for Administrator */}
                {isAdmin && (
                  <div className="flex items-center justify-between pt-2 border-t border-dashed pl-2">
                    <span className="text-[9.5px] text-[#0F3D91] font-bold">
                      Kelola Pengecekan:
                    </span>
                    <button
                      onClick={() => toggleSchoolValidation(sch.id)}
                      className={`text-[10px] font-black px-4 py-1.5 rounded-lg transition-all cursor-pointer active:scale-95 ${
                        isVerified
                          ? "bg-amber-100 text-[#F97316]"
                          : "bg-emerald-500 text-white shadow-xs"
                      }`}
                    >
                      {isVerified ? "MINTA ULANG" : "VALIDASI SEKARANG"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
