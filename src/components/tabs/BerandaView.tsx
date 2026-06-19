import React from "react";
import { useApp } from "../../AppContext";
import { StatCard } from "../StatCard";
import {
  Users,
  TrendingUp,
  School,
  GraduationCap,
  BookOpen,
  UserX,
  Building,
  CheckCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { SchoolLevel } from "../../types";

export const BerandaView: React.FC = () => {
  const {
    state,
    setCurrentDetail,
    selectedSchoolFilter,
    setSelectedSchoolFilter,
    selectedLevelFilter,
    setSelectedLevelFilter,
  } = useApp();

  const user = state.currentUser;
  const isOperator = user?.role === "OPERATOR";

  // If Operator, enforce filtering to only their assigned school!
  const currentSchoolId = isOperator ? (user?.schoolId || "SD_01") : selectedSchoolFilter;

  // Level selector list
  const levels: (SchoolLevel | "all")[] = ["all", SchoolLevel.SD, SchoolLevel.TK, SchoolLevel.KB];

  // Dynamically Filtered list of schools in database
  const filteredSchools = state.schools.filter((sch) => {
    const levelMatch = selectedLevelFilter === "all" || sch.level === selectedLevelFilter;
    const schoolMatch = currentSchoolId === "all" || sch.id === currentSchoolId;
    return levelMatch && schoolMatch;
  });

  // Calculate Aggregated Metrics across filtered schools in real-time
  let totalAdmissionsL = 0;
  let totalAdmissionsP = 0;

  let totalPromotionsL = 0;
  let totalPromotionsP = 0;

  let totalRombelSD = 0;
  let totalRombelTK = 0;
  let totalRombelKB = 0;

  let totalAlumniL = 0;
  let totalAlumniP = 0;

  let totalContinuingL = 0;
  let totalContinuingP = 0;

  let totalNonContinuingL = 0;
  let totalNonContinuingP = 0;

  filteredSchools.forEach((sch) => {
    // 1. Admission numbers
    const adm = state.studentAdmissions.find((a) => a.schoolId === sch.id);
    if (adm) {
      totalAdmissionsL += (adm.domisili.l + adm.afirmasi.l + adm.mutasi.l);
      totalAdmissionsP += (adm.domisili.p + adm.afirmasi.p + adm.mutasi.p);
    }

    // 2. Promotion numbers
    const pro = state.studentPromotions.find((p) => p.schoolId === sch.id);
    if (pro) {
      if (sch.level === SchoolLevel.SD) {
        totalPromotionsL +=
          ((pro.sd_1_to_2?.l || 0) +
            (pro.sd_2_to_3?.l || 0) +
            (pro.sd_3_to_4?.l || 0) +
            (pro.sd_4_to_5?.l || 0) +
            (pro.sd_5_to_6?.l || 0));
        totalPromotionsP +=
          ((pro.sd_1_to_2?.p || 0) +
            (pro.sd_2_to_3?.p || 0) +
            (pro.sd_3_to_4?.p || 0) +
            (pro.sd_4_to_5?.p || 0) +
            (pro.sd_5_to_6?.p || 0));
      } else if (sch.level === SchoolLevel.TK) {
        totalPromotionsL += (pro.tk_a_to_b?.l || 0);
        totalPromotionsP += (pro.tk_a_to_b?.p || 0);
      } else if (sch.level === SchoolLevel.KB) {
        totalPromotionsL += (pro.kb_play_to_cont?.l || 0);
        totalPromotionsP += (pro.kb_play_to_cont?.p || 0);
      }
    }

    // 3. Rombel Counts
    const rom = state.classGroups.find((r) => r.schoolId === sch.id);
    if (rom) {
      totalRombelSD +=
        (rom.sd_g1 + rom.sd_g2 + rom.sd_g3 + rom.sd_g4 + rom.sd_g5 + rom.sd_g6);
      totalRombelTK += (rom.tk_a + rom.tk_b);
      totalRombelKB += (rom.kb_play + rom.kb_cont);
    }

    // 4. Alumni Counts
    const al = state.alumni.find((a) => a.schoolId === sch.id);
    if (al) {
      totalAlumniL += al.l;
      totalAlumniP += al.p;
    }

    // 5. Continuing Counts
    const co = state.continuingStudents.find((c) => c.schoolId === sch.id);
    if (co) {
      totalContinuingL += co.l;
      totalContinuingP += co.p;
    }

    // 6. Non-Continuing Counts
    const nc = state.nonContinuingStudents.find((n) => n.schoolId === sch.id);
    if (nc) {
      totalNonContinuingL += nc.l;
      totalNonContinuingP += nc.p;
    }
  });

  const totalRombelCombined = totalRombelSD + totalRombelTK + totalRombelKB;

  // Real-time school status alerts (For Kecamatan display)
  const pendingCount = filteredSchools.filter((s) => s.status === "PENDING").length;

  return (
    <div className="space-y-5 px-4 pt-4 pb-24 max-w-md mx-auto">
      {/* 1. Header welcome widget & User Role status cards */}
      <div className="bg-[#0F3D91] text-white p-5 rounded-[20px] shadow-soft -mt-2 space-y-4 relative overflow-hidden">
        {/* Decorative circle backdrop */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full" />

        <div className="space-y-1">
          <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest font-mono">
            Akses Lapisan: {user ? user.role : "PUBLIK / TAMU"}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-white leading-none">
            {user ? `Halo, ${user.name}` : "Selamat Datang di SIPENA"}
          </h2>
          <span className="text-[11px] text-blue-100 font-medium block italic max-w-[90%]">
            "Satu Data Siswa, Satu Arah Perencanaan Pendidikan."
          </span>
        </div>

        {/* Dynamic status capsule based on authentication */}
        <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 font-medium text-blue-50">
            <Clock size={14} className="text-emerald-400" />
            <span>TP 2026/2027 • Aktif</span>
          </div>
          {isOperator ? (
            <span className="bg-emerald-500 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Ready Operator
            </span>
          ) : user?.role === "ADMIN" ? (
            <span className="bg-purple-500 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              Kecamatan Admin
            </span>
          ) : (
            <span className="bg-[#22C55E]/20 text-[#22C55E] font-extrabold text-[9px] px-2.5 py-0.5 rounded-full border border-emerald-400/20 tracking-wider">
              Peninjauan Publik
            </span>
          )}
        </div>
      </div>

      {/* 2. Interactive Navigation Filters segment */}
      <div className="bg-white p-4 rounded-[20px] shadow-soft border border-gray-100 space-y-3">
        {/* School Search Lookup list (Only visible to admin/guest) */}
        {!isOperator && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Search size={11} /> Penyaringan Lembaga
            </label>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="w-full h-10 px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">Semua Lembaga ({state.schools.length})</option>
              {state.schools.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  [{sch.level}] {sch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Level Filters Quick tabs (SD, TK, KB) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Filter size={11} strokeWidth={2.5} /> Saring Berdasarkan Tingkatan
          </label>
          <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer capitalize ${
                  selectedLevelFilter === lvl
                    ? "bg-[#0F3D91] text-white shadow-xs"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {lvl === "all" ? "Semua" : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Display alert about statistics range */}
        <div className="text-[10px] text-gray-400 font-medium leading-tight flex items-center gap-2">
          <CheckCircle size={13} className="text-[#22C55E]" />
          <span>
            {selectedSchoolFilter === "all"
              ? "Menampilkan rekap kumulatif gabungan se-Kecamatan."
              : `Menampilkan data khusus ${state.schools.find((s) => s.id === currentSchoolId)?.name}`}
          </span>
        </div>
      </div>

      {/* 3. Comparatives School visual SVG chart comparison */}
      <div className="bg-white p-4 rounded-[20px] shadow-soft border border-gray-100 space-y-3">
        <h3 className="text-xs font-extrabold text-[#0F3D91] uppercase tracking-wider">
          Perbandingan Siswa & Rombel Pasca-Filter
        </h3>
        
        {/* Beautiful high fidelity SVG styled comparisons */}
        <div className="space-y-2 pt-1 font-bold">
          {/* SD Segment bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">SD (Sekolah Dasar)</span>
              <span className="text-[#0F3D91]">
                {totalRombelSD} Rombel
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, (totalRombelSD / (totalRombelCombined || 1)) * 100)}%` }} 
                className="bg-[#0F3D91] h-full rounded-full transition-all duration-300" 
              />
            </div>
          </div>

          {/* TK Segment bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">TK (Taman Kanak-Kanak)</span>
              <span className="text-[#22C55E]">
                {totalRombelTK} Rombel
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, (totalRombelTK / (totalRombelCombined || 1)) * 100)}%` }} 
                className="bg-[#22C55E] h-full rounded-full transition-all duration-300" 
              />
            </div>
          </div>

          {/* KB Segment bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">KB (Kelompok Bermain)</span>
              <span className="text-[#F97316]">
                {totalRombelKB} Rombel
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, (totalRombelKB / (totalRombelCombined || 1)) * 100)}%` }} 
                className="bg-[#F97316] h-full rounded-full transition-all duration-300" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Stat Cards Grid (2 columns, 6 cards - heights: 170px) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-extrabold text-[#0F3D91] uppercase tracking-widest pl-1 leading-none">
            6 KARTU REKAP UTAMA INDIKATOR
          </h4>
          <span className="text-[9.5px] text-gray-400 font-bold">
            Pencet kartu untuk isi rekap
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* KARTU 1: Pendataan Siswa Baru */}
          <StatCard
            id="admissions"
            title="Pendataan Siswa Baru"
            sub="L/P/Total"
            icon={<Users size={16} />}
            color="#0F3D91"
            l={totalAdmissionsL}
            p={totalAdmissionsP}
            total={totalAdmissionsL + totalAdmissionsP}
            onClick={() => setCurrentDetail("admission")}
          />

          {/* KARTU 2: Kenaikan Siswa */}
          <StatCard
            id="promotions"
            title="Kenaikan Siswa"
            sub="Per Kelas/Rombel"
            icon={<TrendingUp size={16} />}
            color="#22C55E"
            l={totalPromotionsL}
            p={totalPromotionsP}
            total={totalPromotionsL + totalPromotionsP}
            onClick={() => setCurrentDetail("promotion")}
          />

          {/* KARTU 3: Jumlah Rombel */}
          <StatCard
            id="rombels"
            title="Jumlah Rombel"
            sub="SD / TK / KB"
            icon={<School size={16} />}
            color="#F97316"
            l={0}
            p={0}
            total={totalRombelCombined}
            isRombel={true}
            rombelDetails={{ sd: totalRombelSD, tk: totalRombelTK, kb: totalRombelKB }}
            onClick={() => setCurrentDetail("rombel")}
          />

          {/* KARTU 4: Data Alumni */}
          <StatCard
            id="alumni"
            title="Data Alumni"
            sub="L/P/Total"
            icon={<GraduationCap size={16} />}
            color="#7C3AED"
            l={totalAlumniL}
            p={totalAlumniP}
            total={totalAlumniL + totalAlumniP}
            onClick={() => setCurrentDetail("alumni")}
          />

          {/* KARTU 5: Data Siswa Melanjutkan */}
          <StatCard
            id="continuing"
            title="Data Siswa Melanjutkan"
            sub="L/P/Total"
            icon={<BookOpen size={16} />}
            color="#10B981"
            l={totalContinuingL}
            p={totalContinuingP}
            total={totalContinuingL + totalContinuingP}
            onClick={() => setCurrentDetail("continuing")}
          />

          {/* KARTU 6: Data Siswa Tidak Melanjutkan */}
          <StatCard
            id="non_continuing"
            title="Siswa Tidak Melanjutkan"
            sub="L/P/Total"
            icon={<UserX size={16} />}
            color="#EF4444"
            l={totalNonContinuingL}
            p={totalNonContinuingP}
            total={totalNonContinuingL + totalNonContinuingP}
            onClick={() => setCurrentDetail("non_continuing")}
          />
        </div>
      </div>
    </div>
  );
};
