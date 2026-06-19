import React, { useState } from "react";
import { useApp, DetailViewType } from "../AppContext";
import { SchoolLevel } from "../types";
import {
  ArrowLeft,
  Save,
  Users,
  TrendingUp,
  School,
  GraduationCap,
  BookOpen,
  UserX,
  Plus,
  Minus,
  CheckCircle,
  FileText,
  AlertCircle,
  Building,
} from "lucide-react";

export const DetailPanel: React.FC = () => {
  const {
    state,
    currentDetail,
    setCurrentDetail,
    saveAdmissions,
    savePromotions,
    saveClassGroups,
    saveAlumni,
    saveContinuing,
    saveNonContinuing,
  } = useApp();

  // Selected School to view or edit
  // Operators can ONLY edit/view their own school's data
  // Guests/Admins can filter by school or see combined totals
  const user = state.currentUser;
  const isOperator = user?.role === "OPERATOR";
  const isAdmin = user?.role === "ADMIN";
  const canEdit = isOperator || isAdmin;

  // Selected school to load / save
  const defaultSchoolId = isOperator ? (user?.schoolId || "SD_01") : "SD_01";
  const [activeSchoolId, setActiveSchoolId] = useState<string>(defaultSchoolId);

  // Active sub-tabs inside details
  const [admissionTab, setAdmissionTab] = useState<"domisili" | "afirmasi" | "mutasi">("domisili");
  const [promotionTab, setPromotionTab] = useState<"SD" | "TK" | "KB">("SD");
  const [rombelTab, setRombelTab] = useState<"SD" | "TK" | "KB">("SD");

  if (!currentDetail) return null;

  // Find the selected school object
  const selectedSchool = state.schools.find((s) => s.id === activeSchoolId) || state.schools[0];

  // Helper: Find item or return defaults
  const admissions = state.studentAdmissions.find((x) => x.schoolId === activeSchoolId) || {
    domisili: { l: 0, p: 0 },
    afirmasi: { l: 0, p: 0 },
    mutasi: { l: 0, p: 0 },
  };

  const promotions = state.studentPromotions.find((x) => x.schoolId === activeSchoolId) || {
    sd_1_to_2: { l: 0, p: 0 },
    sd_2_to_3: { l: 0, p: 0 },
    sd_3_to_4: { l: 0, p: 0 },
    sd_4_to_5: { l: 0, p: 0 },
    sd_5_to_6: { l: 0, p: 0 },
    tk_a_to_b: { l: 0, p: 0 },
    kb_play_to_cont: { l: 0, p: 0 },
  };

  const classGroups = state.classGroups.find((x) => x.schoolId === activeSchoolId) || {
    sd_g1: 0, sd_g2: 0, sd_g3: 0, sd_g4: 0, sd_g5: 0, sd_g6: 0,
    tk_a: 0, tk_b: 0, kb_play: 0, kb_cont: 0,
  };

  const alumni = state.alumni.find((x) => x.schoolId === activeSchoolId) || { l: 0, p: 0 };
  const continuing = state.continuingStudents.find((x) => x.schoolId === activeSchoolId) || { l: 0, p: 0 };
  const nonContinuing = state.nonContinuingStudents.find((x) => x.schoolId === activeSchoolId) || { l: 0, p: 0 };

  // Form edit states (initialized/lazily synced)
  // 1. Admission Temporary Form State
  const [admDomL, setAdmDomL] = useState(admissions.domisili.l);
  const [admDomP, setAdmDomP] = useState(admissions.domisili.p);
  const [admAfiL, setAdmAfiL] = useState(admissions.afirmasi.l);
  const [admAfiP, setAdmAfiP] = useState(admissions.afirmasi.p);
  const [admMutL, setAdmMutL] = useState(admissions.mutasi.l);
  const [admMutP, setAdmMutP] = useState(admissions.mutasi.p);

  // 2. Promotions Temporary Form State
  const [promoSD12L, setPromoSD12L] = useState(promotions.sd_1_to_2?.l || 0);
  const [promoSD12P, setPromoSD12P] = useState(promotions.sd_1_to_2?.p || 0);
  const [promoSD23L, setPromoSD23L] = useState(promotions.sd_2_to_3?.l || 0);
  const [promoSD23P, setPromoSD23P] = useState(promotions.sd_2_to_3?.p || 0);
  const [promoSD34L, setPromoSD34L] = useState(promotions.sd_3_to_4?.l || 0);
  const [promoSD34P, setPromoSD34P] = useState(promotions.sd_3_to_4?.p || 0);
  const [promoSD45L, setPromoSD45L] = useState(promotions.sd_4_to_5?.l || 0);
  const [promoSD45P, setPromoSD45P] = useState(promotions.sd_4_to_5?.p || 0);
  const [promoSD56L, setPromoSD56L] = useState(promotions.sd_5_to_6?.l || 0);
  const [promoSD56P, setPromoSD56P] = useState(promotions.sd_5_to_6?.p || 0);
  const [promoTKL, setPromoTKL] = useState(promotions.tk_a_to_b?.l || 0);
  const [promoTKP, setPromoTKP] = useState(promotions.tk_a_to_b?.p || 0);
  const [promoKBL, setPromoKBL] = useState(promotions.kb_play_to_cont?.l || 0);
  const [promoKBP, setPromoKBP] = useState(promotions.kb_play_to_cont?.p || 0);

  // 3. Class Group Rombel temporary states
  const [romSDG1, setRomSDG1] = useState(classGroups.sd_g1 || 0);
  const [romSDG2, setRomSDG2] = useState(classGroups.sd_g2 || 0);
  const [romSDG3, setRomSDG3] = useState(classGroups.sd_g3 || 0);
  const [romSDG4, setRomSDG4] = useState(classGroups.sd_g4 || 0);
  const [romSDG5, setRomSDG5] = useState(classGroups.sd_g5 || 0);
  const [romSDG6, setRomSDG6] = useState(classGroups.sd_g6 || 0);
  const [romTKA, setRomTKA] = useState(classGroups.tk_a || 0);
  const [romTKB, setRomTKB] = useState(classGroups.tk_b || 0);
  const [romKBPlay, setRomKBPlay] = useState(classGroups.kb_play || 0);
  const [romKBCont, setRomKBCont] = useState(classGroups.kb_cont || 0);

  // 4. Alumni temporary states
  const [alumL, setAlumL] = useState(alumni.l || 0);
  const [alumP, setAlumP] = useState(alumni.p || 0);

  // 5. Continuing temporary states
  const [contL, setContL] = useState(continuing.l || 0);
  const [contP, setContP] = useState(continuing.p || 0);

  // 6. Non Continuing temporary states
  const [nonL, setNonL] = useState(nonContinuing.l || 0);
  const [nonP, setNonP] = useState(nonContinuing.p || 0);

  // Sync state whenever selected school triggers a reload
  const handleSchoolChange = (schoolId: string) => {
    setActiveSchoolId(schoolId);
    
    // Auto sync promotion and rombel sub-tabs based on the selected school's level
    const targetSchool = state.schools.find((s) => s.id === schoolId);
    if (targetSchool) {
      if (targetSchool.level === SchoolLevel.SD) {
        setPromotionTab("SD");
        setRombelTab("SD");
      } else if (targetSchool.level === SchoolLevel.TK) {
        setPromotionTab("TK");
        setRombelTab("TK");
      } else if (targetSchool.level === SchoolLevel.KB) {
        setPromotionTab("KB");
        setRombelTab("KB");
      }
    }

    const schAdm = state.studentAdmissions.find((x) => x.schoolId === schoolId) || {
      domisili: { l: 0, p: 0 }, afirmasi: { l: 0, p: 0 }, mutasi: { l: 0, p: 0 }
    };
    setAdmDomL(schAdm.domisili.l); setAdmDomP(schAdm.domisili.p);
    setAdmAfiL(schAdm.afirmasi.l); setAdmAfiP(schAdm.afirmasi.p);
    setAdmMutL(schAdm.mutasi.l); setAdmMutP(schAdm.mutasi.p);

    const schPromo = state.studentPromotions.find((x) => x.schoolId === schoolId) || {
      sd_1_to_2: { l: 0, p: 0 }, sd_2_to_3: { l: 0, p: 0 }, sd_3_to_4: { l: 0, p: 0 },
      sd_4_to_5: { l: 0, p: 0 }, sd_5_to_6: { l: 0, p: 0 }, tk_a_to_b: { l: 0, p: 0 },
      kb_play_to_cont: { l: 0, p: 0 }
    };
    setPromoSD12L(schPromo.sd_1_to_2?.l || 0); setPromoSD12P(schPromo.sd_1_to_2?.p || 0);
    setPromoSD23L(schPromo.sd_2_to_3?.l || 0); setPromoSD23P(schPromo.sd_2_to_3?.p || 0);
    setPromoSD34L(schPromo.sd_3_to_4?.l || 0); setPromoSD34P(schPromo.sd_3_to_4?.p || 0);
    setPromoSD45L(schPromo.sd_4_to_5?.l || 0); setPromoSD45P(schPromo.sd_4_to_5?.p || 0);
    setPromoSD56L(schPromo.sd_5_to_6?.l || 0); setPromoSD56P(schPromo.sd_5_to_6?.p || 0);
    setPromoTKL(schPromo.tk_a_to_b?.l || 0); setPromoTKP(schPromo.tk_a_to_b?.p || 0);
    setPromoKBL(schPromo.kb_play_to_cont?.l || 0); setPromoKBP(schPromo.kb_play_to_cont?.p || 0);

    const schRom = state.classGroups.find((x) => x.schoolId === schoolId) || {
      sd_g1: 0, sd_g2: 0, sd_g3: 0, sd_g4: 0, sd_g5: 0, sd_g6: 0,
      tk_a: 0, tk_b: 0, kb_play: 0, kb_cont: 0
    };
    setRomSDG1(schRom.sd_g1); setRomSDG2(schRom.sd_g2); setRomSDG3(schRom.sd_g3);
    setRomSDG4(schRom.sd_g4); setRomSDG5(schRom.sd_g5); setRomSDG6(schRom.sd_g6);
    setRomTKA(schRom.tk_a); setRomTKB(schRom.tk_b);
    setRomKBPlay(schRom.kb_play); setRomKBCont(schRom.kb_cont);

    const schAlum = state.alumni.find((x) => x.schoolId === schoolId) || { l: 0, p: 0 };
    setAlumL(schAlum.l); setAlumP(schAlum.p);

    const schCont = state.continuingStudents.find((x) => x.schoolId === schoolId) || { l: 0, p: 0 };
    setContL(schCont.l); setContP(schCont.p);

    const schNon = state.nonContinuingStudents.find((x) => x.schoolId === schoolId) || { l: 0, p: 0 };
    setNonL(schNon.l); setNonP(schNon.p);
  };

  // Submit triggers
  const handleSave = () => {
    if (currentDetail === "admission") {
      saveAdmissions(
        activeSchoolId,
        { l: Number(admDomL), p: Number(admDomP) },
        { l: Number(admAfiL), p: Number(admAfiP) },
        { l: Number(admMutL), p: Number(admMutP) }
      );
    } else if (currentDetail === "promotion") {
      savePromotions(activeSchoolId, {
        sd_1_to_2: { l: Number(promoSD12L), p: Number(promoSD12P) },
        sd_2_to_3: { l: Number(promoSD23L), p: Number(promoSD23P) },
        sd_3_to_4: { l: Number(promoSD34L), p: Number(promoSD34P) },
        sd_4_to_5: { l: Number(promoSD45L), p: Number(promoSD45P) },
        sd_5_to_6: { l: Number(promoSD56L), p: Number(promoSD56P) },
        tk_a_to_b: { l: Number(promoTKL), p: Number(promoTKP) },
        kb_play_to_cont: { l: Number(promoKBL), p: Number(promoKBP) },
      });
    } else if (currentDetail === "rombel") {
      saveClassGroups(activeSchoolId, {
        sd_g1: Number(romSDG1),
        sd_g2: Number(romSDG2),
        sd_g3: Number(romSDG3),
        sd_g4: Number(romSDG4),
        sd_g5: Number(romSDG5),
        sd_g6: Number(romSDG6),
        tk_a: Number(romTKA),
        tk_b: Number(romTKB),
        kb_play: Number(romKBPlay),
        kb_cont: Number(romKBCont),
      });
    } else if (currentDetail === "alumni") {
      saveAlumni(activeSchoolId, Number(alumL), Number(alumP));
    } else if (currentDetail === "continuing") {
      saveContinuing(activeSchoolId, Number(contL), Number(contP));
    } else if (currentDetail === "non_continuing") {
      saveNonContinuing(activeSchoolId, Number(nonL), Number(nonP));
    }
  };

  // UI calculations
  // 1. Admission calculation: Totals per path
  const domTotal = Number(admDomL) + Number(admDomP);
  const afiTotal = Number(admAfiL) + Number(admAfiP);
  const mutTotal = Number(admMutL) + Number(admMutP);
  const totalLakiAdmissions = Number(admDomL) + Number(admAfiL) + Number(admMutL);
  const totalPerempuanAdmissions = Number(admDomP) + Number(admAfiP) + Number(admMutP);
  const grandTotalAdmissions = totalLakiAdmissions + totalPerempuanAdmissions;

  // 2. Promotion step additions
  const totalSDPromoL =
    Number(promoSD12L) + Number(promoSD23L) + Number(promoSD34L) + Number(promoSD45L) + Number(promoSD56L);
  const totalSDPromoP =
    Number(promoSD12P) + Number(promoSD23P) + Number(promoSD34P) + Number(promoSD45P) + Number(promoSD56P);
  const grandTotalSDPromo = totalSDPromoL + totalSDPromoP;

  const totalTKPromoL = Number(promoTKL);
  const totalTKPromoP = Number(promoTKP);
  const grandTotalTKPromo = totalTKPromoL + totalTKPromoP;

  const totalKBPromoL = Number(promoKBL);
  const totalKBPromoP = Number(promoKBP);
  const grandTotalKBPromo = totalKBPromoL + totalKBPromoP;

  // Total automatic promotion calculations (Sum of all active levels chosen)
  const automaticPromoL = totalSDPromoL + totalTKPromoL + totalKBPromoL;
  const automaticPromoP = totalSDPromoP + totalTKPromoP + totalKBPromoP;
  const automaticPromoTotal = automaticPromoL + automaticPromoP;

  // 3. Rombel consolidated tally
  const totalSDRombel =
    Number(romSDG1) + Number(romSDG2) + Number(romSDG3) + Number(romSDG4) + Number(romSDG5) + Number(romSDG6);
  const totalTKRombel = Number(romTKA) + Number(romTKB);
  const totalKBRombel = Number(romKBPlay) + Number(romKBCont);
  const grandTotalRombels = totalSDRombel + totalTKRombel + totalKBRombel;

  // 4, 5, 6. Alumni, continuing, and non-continuing
  const totalAlum = Number(alumL) + Number(alumP);
  const totalCont = Number(contL) + Number(contP);
  const totalNon = Number(nonL) + Number(nonP);

  // Percentages with safety guards
  const contPercent = totalAlum > 0 ? Math.round((totalCont / totalAlum) * 100) : 0;
  const nonPercent = totalAlum > 0 ? Math.round((totalNon / totalAlum) * 100) : 0;

  // Level validation matching
  const matchingSchoolsForFilter = state.schools.filter((sch) => {
    if (currentDetail === "admission") return true; 
    if (currentDetail === "alumni" || currentDetail === "continuing" || currentDetail === "non_continuing") return true;
    if (currentDetail === "promotion") {
      if (promotionTab === "SD" && sch.level === SchoolLevel.SD) return true;
      if (promotionTab === "TK" && sch.level === SchoolLevel.TK) return true;
      if (promotionTab === "KB" && sch.level === SchoolLevel.KB) return true;
    }
    if (currentDetail === "rombel") {
      if (rombelTab === "SD" && sch.level === SchoolLevel.SD) return true;
      if (rombelTab === "TK" && sch.level === SchoolLevel.TK) return true;
      if (rombelTab === "KB" && sch.level === SchoolLevel.KB) return true;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 max-w-md mx-auto relative shadow-xl">
      {/* Detail Header Accent */}
      <div className="bg-[#0F3D91] text-white px-4 pt-4 pb-12 rounded-b-[30px] flex flex-col gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDetail(null)}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-200 tracking-widest block font-mono">
              SIPENA Detail Rekap
            </span>
            <h2 className="text-lg font-bold text-white capitalize leading-tight mt-0.5">
              {currentDetail === "admission" && "Pendataan Siswa Baru"}
              {currentDetail === "promotion" && "Kenaikan Siswa"}
              {currentDetail === "rombel" && "Jumlah Rombel"}
              {currentDetail === "alumni" && "Keluaran Alumni"}
              {currentDetail === "continuing" && "Melanjutkan Studi"}
              {currentDetail === "non_continuing" && "Tidak Melanjutkan"}
            </h2>
          </div>
        </div>

        {/* Informational warning */}
        <div className="bg-white/10 rounded-xl p-3 flex items-start gap-2.5 backdrop-blur-xs text-[11px] font-medium">
          <AlertCircle size={15} className="text-amber-200 shrink-0 mt-0.5" />
          <p className="text-blue-100 flex-1 leading-relaxed">
            Sistem mencatat rekap total angka instansi secara kolektif.{" "}
            <strong>Bebas dari pencatatan identitas individu nama siswa.</strong>
          </p>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-[20px] p-4 shadow-soft border border-gray-100 space-y-4">
          
          {/* School Selector (Dynamic unless logged in as OP) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Lembaga Sekolah SD/TK/KB
            </label>
            {isOperator ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                <Building size={16} className="text-[#0F3D91]" />
                <span className="text-xs font-bold text-gray-800">
                  {selectedSchool?.name || "Sekolah Operator"}
                </span>
                <span className="ml-auto text-[9px] bg-blue-100 text-[#0F3D91] px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                  OPS
                </span>
              </div>
            ) : (
              <select
                value={activeSchoolId}
                onChange={(e) => handleSchoolChange(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-2xs"
              >
                {state.schools.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    [{sch.level}] {sch.name} ({sch.status})
                  </option>
                ))}
              </select>
            )}
            <p className="text-[9.5px] italic text-gray-400 font-medium">
              Status Validasi Kecamatan:{" "}
              <strong
                className={selectedSchool?.status === "VALID" ? "text-emerald-500" : "text-amber-500"}
              >
                {selectedSchool?.status || "PENDING"}
              </strong>
            </p>
          </div>

          <div className="h-[1px] bg-gray-100 my-1" />

          {/* ======================= DETAILED VIEWS IMPLEMENTATIONS ======================= */}

          {/* 1. SISWA BARU ADMISSION DATA */}
          {currentDetail === "admission" && (
            <div className="space-y-4">
              {/* Tabs: Domisili, Afirmasi, Mutasi */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                {(["domisili", "afirmasi", "mutasi"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAdmissionTab(tab)}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                      admissionTab === tab
                        ? "bg-[#0F3D91] text-white shadow-xs"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Conditional Inputs */}
              <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100/50 space-y-4">
                <h4 className="text-xs font-extrabold text-[#0F3D91] uppercase tracking-wider flex items-center gap-2">
                  <Users size={14} /> JALUR {admissionTab}
                </h4>

                {/* Admission tab data */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Laki-Laki */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Laki-Laki (L)
                    </label>
                    <input
                      type="number"
                      min="0"
                      disabled={!canEdit}
                      value={
                        admissionTab === "domisili"
                          ? admDomL
                          : admissionTab === "afirmasi"
                          ? admAfiL
                          : admMutL
                      }
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        if (admissionTab === "domisili") setAdmDomL(val);
                        else if (admissionTab === "afirmasi") setAdmAfiL(val);
                        else setAdmMutL(val);
                      }}
                      className="h-11 px-3 bg-white border border-gray-200 rounded-xl text-center text-sm font-extrabold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-2xs"
                    />
                  </div>

                  {/* Perempuan */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Perempuan (P)
                    </label>
                    <input
                      type="number"
                      min="0"
                      disabled={!canEdit}
                      value={
                        admissionTab === "domisili"
                          ? admDomP
                          : admissionTab === "afirmasi"
                          ? admAfiP
                          : admMutP
                      }
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        if (admissionTab === "domisili") setAdmDomP(val);
                        else if (admissionTab === "afirmasi") setAdmAfiP(val);
                        else setAdmMutP(val);
                      }}
                      className="h-11 px-3 bg-white border border-gray-200 rounded-xl text-center text-sm font-extrabold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Total per tab */}
                <div className="bg-[#E0F2FE]/40 border border-blue-100 p-3 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold">Total Jalur {admissionTab}:</span>
                  <strong className="text-[#0F3D91] text-sm font-extrabold">
                    {admissionTab === "domisili" && domTotal}
                    {admissionTab === "afirmasi" && afiTotal}
                    {admissionTab === "mutasi" && mutTotal} Siswa
                  </strong>
                </div>
              </div>

              {/* Total Rekap Seluruh Jalur baru */}
              <div className="bg-[#F0FDF4] border border-[#22C55E]/20 rounded-[20px] p-4 space-y-3">
                <h4 className="text-xs font-extrabold text-[#22C55E] uppercase tracking-wider">
                  Rekap Seluruh Jalur Siswa Baru
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-bold">LAKI-LAKI</p>
                    <p className="text-xs font-extrabold text-gray-800 mt-0.5">{totalLakiAdmissions}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-bold">PEREMPUAN</p>
                    <p className="text-xs font-extrabold text-gray-800 mt-0.5">{totalPerempuanAdmissions}</p>
                  </div>
                  <div className="bg-[#22C55E] p-2.5 rounded-xl text-white">
                    <p className="text-[9px] text-[#E8FBF0] font-bold">TOTAL</p>
                    <p className="text-xs font-extrabold mt-0.5">{grandTotalAdmissions}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. KENAIKAN SISWA PROMOTION */}
          {currentDetail === "promotion" && (
            <div className="space-y-4">
              {/* Level Tab */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                {(["SD", "TK", "KB"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setPromotionTab(tab);
                      // If mismatched, quick change school to fit levels to avoid user confusion
                      const matchSch = state.schools.find((s) => s.level === tab);
                      if (matchSch && !isOperator) {
                        handleSchoolChange(matchSch.id);
                      }
                    }}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      promotionTab === tab
                        ? "bg-[#0F3D91] text-white shadow-xs"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Warning label if matching level is wrong */}
              {selectedSchool?.level !== promotionTab && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-[10px] text-orange-600 font-semibold leading-relaxed flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>
                    Sekolah terpilih ({selectedSchool?.name}) memiliki jenjang{" "}
                    <strong>{selectedSchool?.level}</strong>. Ganti sekolah atau tab agar data sesuai.
                  </span>
                </div>
              )}

              {/* Edit grids based on tab */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                {promotionTab === "SD" && (
                  <>
                    {[
                      { label: "Kelas I → II", l: promoSD12L, setL: setPromoSD12L, p: promoSD12P, setP: setPromoSD12P },
                      { label: "Kelas II → III", l: promoSD23L, setL: setPromoSD23L, p: promoSD23P, setP: setPromoSD23P },
                      { label: "Kelas III → IV", l: promoSD34L, setL: setPromoSD34L, p: promoSD34P, setP: setPromoSD34P },
                      { label: "Kelas IV → V", l: promoSD45L, setL: setPromoSD45L, p: promoSD45P, setP: setPromoSD45P },
                      { label: "Kelas V → VI", l: promoSD56L, setL: setPromoSD56L, p: promoSD56P, setP: setPromoSD56P },
                    ].map((step, idx) => (
                      <div key={idx} className="bg-gray-50/50 border border-gray-100 p-3 rounded-[20px] space-y-2">
                        <span className="text-[11px] font-bold text-gray-700">{step.label}</span>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            min="0"
                            disabled={!canEdit || selectedSchool?.level !== "SD"}
                            value={step.l}
                            onChange={(e) => step.setL(Math.max(0, Number(e.target.value)))}
                            placeholder="L"
                            className="h-10 border border-gray-200 bg-white rounded-xl text-xs font-bold text-center"
                          />
                          <input
                            type="number"
                            min="0"
                            disabled={!canEdit || selectedSchool?.level !== "SD"}
                            value={step.p}
                            onChange={(e) => step.setP(Math.max(0, Number(e.target.value)))}
                            placeholder="P"
                            className="h-10 border border-gray-200 bg-white rounded-xl text-xs font-bold text-center"
                          />
                          <div className="h-10 bg-blue-50/50 rounded-xl flex items-center justify-center text-xs font-extrabold text-[#0F3D91]">
                            {Number(step.l) + Number(step.p)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {promotionTab === "TK" && (
                  <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-[20px] space-y-2">
                    <span className="text-[11px] font-bold text-gray-700">Kelompok A → Kelompok B</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        min="0"
                        disabled={!canEdit || selectedSchool?.level !== "TK"}
                        value={promoTKL}
                        onChange={(e) => setPromoTKL(Math.max(0, Number(e.target.value)))}
                        placeholder="L"
                        className="h-10 border border-gray-200 bg-white rounded-xl text-xs font-bold text-center"
                      />
                      <input
                        type="number"
                        min="0"
                        disabled={!canEdit || selectedSchool?.level !== "TK"}
                        value={promoTKP}
                        onChange={(e) => setPromoTKP(Math.max(0, Number(e.target.value)))}
                        placeholder="P"
                        className="h-10 border border-gray-200 bg-white rounded-xl text-xs font-bold text-center"
                      />
                      <div className="h-10 bg-blue-50/50 rounded-xl flex items-center justify-center text-xs font-extrabold text-[#0F3D91]">
                        {Number(promoTKL) + Number(promoTKP)}
                      </div>
                    </div>
                  </div>
                )}

                {promotionTab === "KB" && (
                  <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-[20px] space-y-2">
                    <span className="text-[11px] font-bold text-gray-700">Kelompok Bermain → Kelompok Lanjutan</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        min="0"
                        disabled={!canEdit || selectedSchool?.level !== "KB"}
                        value={promoKBL}
                        onChange={(e) => setPromoKBL(Math.max(0, Number(e.target.value)))}
                        placeholder="L"
                        className="h-10 border border-gray-200 bg-white rounded-xl text-xs font-bold text-center"
                      />
                      <input
                        type="number"
                        min="0"
                        disabled={!canEdit || selectedSchool?.level !== "KB"}
                        value={promoKBP}
                        onChange={(e) => setPromoKBP(Math.max(0, Number(e.target.value)))}
                        placeholder="P"
                        className="h-10 border border-gray-200 bg-white rounded-xl text-xs font-bold text-center"
                      />
                      <div className="h-10 bg-blue-50/50 rounded-xl flex items-center justify-center text-xs font-extrabold text-[#0F3D91]">
                        {Number(promoKBL) + Number(promoKBP)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total naik kelas otomatis */}
              <div className="bg-[#F0FDF4] border border-[#22C55E]/20 rounded-[20px] p-4 flex flex-col gap-2">
                <span className="text-xs font-extrabold text-[#22C55E] uppercase tracking-wider leading-none">
                  Total Naik Kelas Otomatis
                </span>
                <p className="text-[10px] text-gray-400 font-medium">
                  Merupakan penjumlahan total digital otomatis lintas jenjang rekap sekolah aktif
                </p>
                <div className="grid grid-cols-3 gap-2 text-center mt-1">
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <p className="text-[8px] text-gray-400 font-bold">LAKI-LAKI</p>
                    <p className="text-xs font-extrabold text-gray-700">{automaticPromoL}</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <p className="text-[8px] text-gray-400 font-bold">PEREMPUAN</p>
                    <p className="text-xs font-extrabold text-gray-700">{automaticPromoP}</p>
                  </div>
                  <div className="bg-[#22C55E] p-2 rounded-xl text-white">
                    <p className="text-[8px] text-[#E8FBF0] font-bold">MUTLAK TOT</p>
                    <p className="text-xs font-bold">{automaticPromoTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. JUMLAH ROMBEL TYPE */}
          {currentDetail === "rombel" && (
            <div className="space-y-4">
              {/* Tabs level selection */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                {(["SD", "TK", "KB"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setRombelTab(tab);
                      const matchSch = state.schools.find((s) => s.level === tab);
                      if (matchSch && !isOperator) {
                        handleSchoolChange(matchSch.id);
                      }
                    }}
                    className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      rombelTab === tab
                        ? "bg-[#0F3D91] text-white shadow-xs"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {selectedSchool?.level !== rombelTab && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-[10px] text-orange-600 font-semibold leading-relaxed flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>
                    Sekolah terpilih ({selectedSchool?.name}) memiliki jenjang{" "}
                    <strong>{selectedSchool?.level}</strong>. Sesuaikan sekolah atau tab.
                  </span>
                </div>
              )}

              {/* Rombel grids */}
              <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                {rombelTab === "SD" && (
                  <>
                    {[
                      { label: "Kelas I", value: romSDG1, set: setRomSDG1 },
                      { label: "Kelas II", value: romSDG2, set: setRomSDG2 },
                      { label: "Kelas III", value: romSDG3, set: setRomSDG3 },
                      { label: "Kelas IV", value: romSDG4, set: setRomSDG4 },
                      { label: "Kelas V", value: romSDG5, set: setRomSDG5 },
                      { label: "Kelas VI", value: romSDG6, set: setRomSDG6 },
                    ].map((g, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl flex flex-col gap-1 text-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{g.label}</span>
                        <input
                          type="number"
                          min="0"
                          disabled={!canEdit || selectedSchool?.level !== "SD"}
                          value={g.value}
                          onChange={(e) => g.set(Math.max(0, Number(e.target.value)))}
                          className="h-10 text-center text-sm font-extrabold bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:outline-none"
                        />
                      </div>
                    ))}
                  </>
                )}

                {rombelTab === "TK" && (
                  <>
                    {[
                      { label: "Kelompok A", value: romTKA, set: setRomTKA },
                      { label: "Kelompok B", value: romTKB, set: setRomTKB },
                    ].map((g, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl flex flex-col gap-1 text-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{g.label}</span>
                        <input
                          type="number"
                          min="0"
                          disabled={!canEdit || selectedSchool?.level !== "TK"}
                          value={g.value}
                          onChange={(e) => g.set(Math.max(0, Number(e.target.value)))}
                          className="h-10 text-center text-sm font-extrabold bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:outline-none"
                        />
                      </div>
                    ))}
                  </>
                )}

                {rombelTab === "KB" && (
                  <>
                    {[
                      { label: "Kelompok Bermain", value: romKBPlay, set: setRomKBPlay },
                      { label: "Kelompok Lanjutan", value: romKBCont, set: setRomKBCont },
                    ].map((g, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl flex flex-col gap-1 text-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{g.label}</span>
                        <input
                          type="number"
                          min="0"
                          disabled={!canEdit || selectedSchool?.level !== "KB"}
                          value={g.value}
                          onChange={(e) => g.set(Math.max(0, Number(e.target.value)))}
                          className="h-10 text-center text-sm font-extrabold bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-100 focus:outline-none"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Display Total Rombel */}
              <div className="bg-amber-50 border border-[#F97316]/20 p-4 rounded-[20px] flex justify-between items-center text-xs">
                <div className="flex flex-col gap-1">
                  <span className="font-extrabold text-[#F97316] uppercase tracking-wider">Total Rombel</span>
                  <span className="text-[10px] text-gray-400 font-medium">Berdasarkan data input tabaktif</span>
                </div>
                <strong className="text-lg font-bold text-[#F97316] bg-white px-4 py-2 rounded-xl shadow-2xs border border-[#F97316]/10">
                  {rombelTab === "SD" && totalSDRombel}
                  {rombelTab === "TK" && totalTKRombel}
                  {rombelTab === "KB" && totalKBRombel} Kelas
                </strong>
              </div>
            </div>
          )}

          {/* 4. DATA ALUMNI */}
          {currentDetail === "alumni" && (
            <div className="space-y-4">
              <span className="text-[10px] text-[#7C3AED] font-extrabold uppercase tracking-wide block">
                REKAP ALUMNI TAHUN PELAJARAN 2025/2026
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 bg-purple-50/20 border border-purple-100/50 p-3 rounded-xl">
                  <label className="text-[10px] text-purple-600 font-bold uppercase">Laki-Laki</label>
                  <input
                    type="number"
                    min="0"
                    disabled={!canEdit}
                    value={alumL}
                    onChange={(e) => setAlumL(Math.max(0, Number(e.target.value)))}
                    className="h-11 bg-white border border-purple-100 text-center text-sm font-extrabold rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1.5 bg-purple-50/20 border border-purple-100/50 p-3 rounded-xl">
                  <label className="text-[10px] text-purple-600 font-bold uppercase">Perempuan</label>
                  <input
                    type="number"
                    min="0"
                    disabled={!canEdit}
                    value={alumP}
                    onChange={(e) => setAlumP(Math.max(0, Number(e.target.value)))}
                    className="h-11 bg-white border border-purple-100 text-center text-sm font-extrabold rounded-lg"
                  />
                </div>
              </div>

              {/* Master Card */}
              <div className="bg-[#7C3AED] text-white p-4 rounded-[20px] shadow-soft flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-purple-200">Total Mutlak Alumni</h5>
                    <p className="text-[9.5px] text-purple-100 mt-0.5">TP 2025/2026</p>
                  </div>
                </div>
                <strong className="text-xl font-black">{totalAlum}</strong>
              </div>
            </div>
          )}

          {/* 5. DATA SISWA MELANJUTKAN */}
          {currentDetail === "continuing" && (
            <div className="space-y-4">
              <span className="text-[10px] text-[#22C55E] font-extrabold uppercase tracking-wide block">
                DATA SISWA MELANJUTKAN (TP 2026/2027)
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 bg-emerald-50/20 border border-emerald-100/50 p-3 rounded-xl">
                  <label className="text-[10px] text-emerald-600 font-bold uppercase">Laki-Laki (L)</label>
                  <input
                    type="number"
                    min="0"
                    disabled={!canEdit}
                    value={contL}
                    onChange={(e) => setContL(Math.max(0, Number(e.target.value)))}
                    className="h-11 bg-white border border-emerald-100 text-center text-sm font-extrabold rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1.5 bg-emerald-50/20 border border-emerald-100/50 p-3 rounded-xl">
                  <label className="text-[10px] text-emerald-600 font-bold uppercase">Perempuan (P)</label>
                  <input
                    type="number"
                    min="0"
                    disabled={!canEdit}
                    value={contP}
                    onChange={(e) => setContP(Math.max(0, Number(e.target.value)))}
                    className="h-11 bg-white border border-emerald-100 text-center text-sm font-extrabold rounded-lg"
                  />
                </div>
              </div>

              {/* Progress and percentage card */}
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-[20px] space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Persentase Melanjutkan:</span>
                  <strong className="text-emerald-500 font-extrabold text-sm">{contPercent}%</strong>
                </div>

                {/* Styled progress bar */}
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border">
                  <div
                    style={{ width: `${contPercent}%` }}
                    className="bg-[#22C55E] h-full transition-all duration-500 rounded-full"
                  />
                </div>

                <div className="bg-white p-2.5 rounded-xl text-[10.5px] text-gray-500 font-medium leading-relaxed">
                  Total Melanjutkan: <strong>{totalCont}</strong> dari{" "}
                  <strong>{totalAlum}</strong> alumni
                </div>
              </div>
            </div>
          )}

          {/* 6. DATA SISWA TIDAK MELANJUTKAN */}
          {currentDetail === "non_continuing" && (
            <div className="space-y-4">
              <span className="text-[10px] text-[#EF4444] font-extrabold uppercase tracking-wide block">
                DATA SISWA TIDAK MELANJUTKAN (TP 2026/2027)
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 bg-red-50/20 border border-red-100/50 p-3 rounded-xl">
                  <label className="text-[10px] text-red-500 font-bold uppercase">Laki-Laki (L)</label>
                  <input
                    type="number"
                    min="0"
                    disabled={!canEdit}
                    value={nonL}
                    onChange={(e) => setNonL(Math.max(0, Number(e.target.value)))}
                    className="h-11 bg-white border border-red-100 text-center text-sm font-extrabold rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1.5 bg-red-50/20 border border-red-100/50 p-3 rounded-xl">
                  <label className="text-[10px] text-red-500 font-bold uppercase">Perempuan (P)</label>
                  <input
                    type="number"
                    min="0"
                    disabled={!canEdit}
                    value={nonP}
                    onChange={(e) => setNonP(Math.max(0, Number(e.target.value)))}
                    className="h-11 bg-white border border-red-100 text-center text-sm font-extrabold rounded-lg"
                  />
                </div>
              </div>

              {/* Progress and percentage card */}
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-[20px] space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Persentase Tidak Melanjutkan:</span>
                  <strong className="text-red-500 font-extrabold text-sm">{nonPercent}%</strong>
                </div>

                {/* Styled progress bar */}
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border">
                  <div
                    style={{ width: `${nonPercent}%` }}
                    className="bg-[#EF4444] h-full transition-all duration-500 rounded-full"
                  />
                </div>

                <div className="bg-white p-2.5 rounded-xl text-[10.5px] text-gray-500 font-medium leading-relaxed">
                  Total Tidak Melanjutkan: <strong>{totalNon}</strong> dari{" "}
                  <strong>{totalAlum}</strong> alumni
                </div>
              </div>
            </div>
          )}

          {/* Save trigger buttons (Visible to Ops/Admins ONLY) */}
          {canEdit && (
            <div className="pt-2">
              <button
                id="btn-save-rekap"
                onClick={handleSave}
                className="w-full bg-[#0F3D91] hover:bg-[#0c3276] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Save size={18} /> Simpan Pembaruan Angka
              </button>
            </div>
          )}

          {/* Close Panel Button */}
          <button
            onClick={() => setCurrentDetail(null)}
            className="w-full h-11 border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};
