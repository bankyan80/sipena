import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AppState,
  loadState,
} from "./stateStore";
import {
  User,
  UserRole,
  SchoolLevel,
  StudentAdmissions,
  StudentPromotions,
  ClassGroups,
  Alumni,
  ContinuingStudents,
  NonContinuingStudents,
} from "./types";
import { api } from "./api";

export type DetailViewType =
  | "admission"
  | "promotion"
  | "rombel"
  | "alumni"
  | "continuing"
  | "non_continuing";

interface AppContextType {
  state: AppState;
  loading: boolean;
  error: string | null;
  activeTab: "beranda" | "rekap" | "login" | "profil";
  currentDetail: DetailViewType | null;
  selectedSchoolFilter: string;
  selectedLevelFilter: SchoolLevel | "all";
  splashActive: boolean;

  setActiveTab: (tab: "beranda" | "rekap" | "login" | "profil") => void;
  setCurrentDetail: (view: DetailViewType | null) => void;
  setSelectedSchoolFilter: (id: string) => void;
  setSelectedLevelFilter: (lvl: SchoolLevel | "all") => void;
  finishSplash: () => void;

  login: (username: string, password: string) => boolean;
  logout: () => void;

  saveAdmissions: (schoolId: string, domisili: { l: number; p: number }, afirmasi: { l: number; p: number }, mutasi: { l: number; p: number }) => void;
  savePromotions: (schoolId: string, data: Partial<StudentPromotions>) => void;
  saveClassGroups: (schoolId: string, data: Partial<ClassGroups>) => void;
  saveAlumni: (schoolId: string, l: number, p: number) => void;
  saveContinuing: (schoolId: string, l: number, p: number) => void;
  saveNonContinuing: (schoolId: string, l: number, p: number) => void;

  toggleSchoolValidation: (schoolId: string) => void;

  pushNotifications: string[];
  triggerNotification: (message: string) => void;
  clearNotifications: () => void;
  refreshState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "sipena_db_state";

function loadLocalState(): AppState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.schools && parsed.schools.length > 0) return parsed;
    }
  } catch {}
  return null;
}

function saveLocalState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const cached = loadLocalState();
    if (cached) return cached;
    return {
      schools: [],
      studentAdmissions: [],
      studentPromotions: [],
      classGroups: [],
      alumni: [],
      continuingStudents: [],
      nonContinuingStudents: [],
      currentUser: null,
    };
  });
  const [loading, setLoading] = useState(!loadLocalState());
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTabInternal] = useState<"beranda" | "rekap" | "login" | "profil">("beranda");
  const [currentDetail, setCurrentDetail] = useState<DetailViewType | null>(null);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>("all");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<SchoolLevel | "all">("all");
  const [splashActive, setSplashActive] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<string[]>([
    "Selamat datang di SIPENA Tahun Pelajaran 2026/2027!",
    "Admin Kecamatan: Silakan rekap data siswa baru sebelum 1 Juli 2026.",
  ]);

  useEffect(() => {
    loadState().then((apiState) => {
      setState((prev) => ({
        ...apiState,
        currentUser: prev.currentUser,
      }));
      setLoading(false);
    }).catch((e) => {
      setError(e instanceof Error ? e.message : "Gagal memuat data dari server");
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    saveLocalState(state);
  }, [state]);

  const refreshState = async () => {
    const apiState = await loadState();
    setState((prev) => ({
      ...apiState,
      currentUser: prev.currentUser,
    }));
  };

  const finishSplash = () => setSplashActive(false);

  const setActiveTab = (tab: "beranda" | "rekap" | "login" | "profil") => {
    setActiveTabInternal(tab);
    setCurrentDetail(null);
  };

  const login = (username: string, password: string): boolean => {
    const nowISO = new Date().toISOString();

    if (username.toLowerCase() === "admin" && password === "spadmin") {
      const matchedUser: User = {
        id: "usr_admin",
        username: "admin",
        name: "Admin Kecamatan Utama",
        role: UserRole.ADMIN,
        created_at: nowISO,
        updated_at: nowISO,
        created_by: "system",
      };
      setState((prev) => ({ ...prev, currentUser: matchedUser }));
      triggerNotification("Login Berhasil! Masuk sebagai Admin.");
      setActiveTab("beranda");
      return true;
    }

    const npsn = username.trim();
    const expectedPassword = "sp" + npsn;
    if (password !== expectedPassword) {
      return false;
    }

    const school = state.schools.find((s) => s.npsn === npsn);
    if (!school) {
      return false;
    }

    const matchedUser: User = {
      id: "usr_" + npsn,
      username: npsn,
      name: "Operator " + school.name,
      role: UserRole.OPERATOR,
      schoolId: school.id,
      created_at: nowISO,
      updated_at: nowISO,
      created_by: "system",
    };

    setState((prev) => ({ ...prev, currentUser: matchedUser }));
    triggerNotification("Login Berhasil! Masuk sebagai Operator " + school.name + ".");
    setActiveTab("beranda");
    return true;
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUser: null }));
    setActiveTab("beranda");
    triggerNotification("Anda telah keluar dari aplikasi.");
  };

  const saveCounts = async <T extends Record<string, number | null>>(
    fetcher: (schoolId: string, data: T) => Promise<unknown>,
    schoolId: string,
    data: T,
    setter: (prev: AppState) => AppState,
    message: string,
  ) => {
    setState(setter);
    triggerNotification(message);
    try {
      await fetcher(schoolId, data);
      const fresh = await loadState();
      setState((prev) => ({ ...fresh, currentUser: prev.currentUser }));
    } catch (e) {
      triggerNotification(`Gagal menyimpan ke database: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };

  const saveAdmissions = (
    schoolId: string,
    domisili: { l: number; p: number },
    afirmasi: { l: number; p: number },
    mutasi: { l: number; p: number }
  ) => {
    const nowISO = new Date().toISOString();
    const data = {
      domisili_l: domisili.l, domisili_p: domisili.p,
      afirmasi_l: afirmasi.l, afirmasi_p: afirmasi.p,
      mutasi_l: mutasi.l, mutasi_p: mutasi.p,
      created_by: state.currentUser?.name || "operator",
    };
    saveCounts(
      (sid, d) => api.saveAdmission(sid, d as Record<string, number>),
      schoolId, data,
      (prev) => {
        const idx = prev.studentAdmissions.findIndex((x) => x.schoolId === schoolId);
        const item = {
          id: `${schoolId}_2026`, schoolId, year: "2026/2027",
          domisili, afirmasi, mutasi,
          created_at: idx >= 0 ? prev.studentAdmissions[idx].created_at : nowISO,
          updated_at: nowISO,
          created_by: prev.currentUser?.name || "operator",
        };
        const list = [...prev.studentAdmissions];
        if (idx >= 0) list[idx] = item; else list.push(item);
        return { ...prev, studentAdmissions: list };
      },
      "Data Pendataan Siswa Baru berhasil disimpan.",
    );
  };

  const savePromotions = (schoolId: string, data: Partial<StudentPromotions>) => {
    const nowISO = new Date().toISOString();
    const dbData: Record<string, number | null> = {
      sd_1_to_2_l: data.sd_1_to_2?.l ?? null, sd_1_to_2_p: data.sd_1_to_2?.p ?? null,
      sd_2_to_3_l: data.sd_2_to_3?.l ?? null, sd_2_to_3_p: data.sd_2_to_3?.p ?? null,
      sd_3_to_4_l: data.sd_3_to_4?.l ?? null, sd_3_to_4_p: data.sd_3_to_4?.p ?? null,
      sd_4_to_5_l: data.sd_4_to_5?.l ?? null, sd_4_to_5_p: data.sd_4_to_5?.p ?? null,
      sd_5_to_6_l: data.sd_5_to_6?.l ?? null, sd_5_to_6_p: data.sd_5_to_6?.p ?? null,
      tk_a_to_b_l: data.tk_a_to_b?.l ?? null, tk_a_to_b_p: data.tk_a_to_b?.p ?? null,
      kb_play_to_cont_l: data.kb_play_to_cont?.l ?? null, kb_play_to_cont_p: data.kb_play_to_cont?.p ?? null,
      created_by: state.currentUser?.name || "operator",
    };
    saveCounts(
      (sid, d) => api.savePromotion(sid, d),
      schoolId, dbData,
      (prev) => {
        const idx = prev.studentPromotions.findIndex((x) => x.schoolId === schoolId);
        const existing = idx >= 0 ? prev.studentPromotions[idx] : {} as StudentPromotions;
        const item = {
          id: `${schoolId}_2026`, schoolId, year: "2026/2027",
          ...existing, ...data,
          created_at: idx >= 0 ? prev.studentPromotions[idx].created_at : nowISO,
          updated_at: nowISO,
          created_by: prev.currentUser?.name || "operator",
        } as StudentPromotions;
        const list = [...prev.studentPromotions];
        if (idx >= 0) list[idx] = item; else list.push(item);
        return { ...prev, studentPromotions: list };
      },
      "Data Kenaikan Siswa berhasil disimpan.",
    );
  };

  const saveClassGroups = (schoolId: string, data: Partial<ClassGroups>) => {
    const nowISO = new Date().toISOString();
    const dbData: Record<string, number> = {
      sd_g1: data.sd_g1 ?? 0, sd_g2: data.sd_g2 ?? 0, sd_g3: data.sd_g3 ?? 0,
      sd_g4: data.sd_g4 ?? 0, sd_g5: data.sd_g5 ?? 0, sd_g6: data.sd_g6 ?? 0,
      tk_a: data.tk_a ?? 0, tk_b: data.tk_b ?? 0,
      kb_play: data.kb_play ?? 0, kb_cont: data.kb_cont ?? 0,
      created_by: state.currentUser?.name || "operator",
    };
    saveCounts(
      (sid, d) => api.saveClassGroup(sid, d),
      schoolId, dbData,
      (prev) => {
        const idx = prev.classGroups.findIndex((x) => x.schoolId === schoolId);
        const existing = idx >= 0 ? prev.classGroups[idx] : {
          sd_g1: 0, sd_g2: 0, sd_g3: 0, sd_g4: 0, sd_g5: 0, sd_g6: 0,
          tk_a: 0, tk_b: 0, kb_play: 0, kb_cont: 0,
        };
        const item = {
          id: `${schoolId}_2026`, schoolId, year: "2026/2027",
          ...existing, ...data,
          created_at: idx >= 0 ? prev.classGroups[idx].created_at : nowISO,
          updated_at: nowISO,
          created_by: prev.currentUser?.name || "operator",
        } as ClassGroups;
        const list = [...prev.classGroups];
        if (idx >= 0) list[idx] = item; else list.push(item);
        return { ...prev, classGroups: list };
      },
      "Data Jumlah Rombel berhasil disimpan.",
    );
  };

  const saveAlumni = (schoolId: string, l: number, p: number) => {
    const nowISO = new Date().toISOString();
    saveCounts(
      (sid, d) => api.saveAlumni(sid, d),
      schoolId, { l, p, created_by: state.currentUser?.name || "operator" },
      (prev) => {
        const idx = prev.alumni.findIndex((x) => x.schoolId === schoolId);
        const item = {
          id: `${schoolId}_2025`, schoolId, year: "2025/2026", l, p,
          created_at: idx >= 0 ? prev.alumni[idx].created_at : nowISO,
          updated_at: nowISO,
          created_by: prev.currentUser?.name || "operator",
        } as Alumni;
        const list = [...prev.alumni];
        if (idx >= 0) list[idx] = item; else list.push(item);
        return { ...prev, alumni: list };
      },
      "Data Alumni berhasil diupdate.",
    );
  };

  const saveContinuing = (schoolId: string, l: number, p: number) => {
    const nowISO = new Date().toISOString();
    saveCounts(
      (sid, d) => api.saveContinuing(sid, d),
      schoolId, { l, p, created_by: state.currentUser?.name || "operator" },
      (prev) => {
        const idx = prev.continuingStudents.findIndex((x) => x.schoolId === schoolId);
        const item = {
          id: `${schoolId}_2026`, schoolId, year: "2026/2027", l, p,
          created_at: idx >= 0 ? prev.continuingStudents[idx].created_at : nowISO,
          updated_at: nowISO,
          created_by: prev.currentUser?.name || "operator",
        } as ContinuingStudents;
        const list = [...prev.continuingStudents];
        if (idx >= 0) list[idx] = item; else list.push(item);
        return { ...prev, continuingStudents: list };
      },
      "Data Siswa Melanjutkan berhasil diupdate.",
    );
  };

  const saveNonContinuing = (schoolId: string, l: number, p: number) => {
    const nowISO = new Date().toISOString();
    saveCounts(
      (sid, d) => api.saveNonContinuing(sid, d),
      schoolId, { l, p, created_by: state.currentUser?.name || "operator" },
      (prev) => {
        const idx = prev.nonContinuingStudents.findIndex((x) => x.schoolId === schoolId);
        const item = {
          id: `${schoolId}_2026`, schoolId, year: "2026/2027", l, p,
          created_at: idx >= 0 ? prev.nonContinuingStudents[idx].created_at : nowISO,
          updated_at: nowISO,
          created_by: prev.currentUser?.name || "operator",
        } as NonContinuingStudents;
        const list = [...prev.nonContinuingStudents];
        if (idx >= 0) list[idx] = item; else list.push(item);
        return { ...prev, nonContinuingStudents: list };
      },
      "Data Siswa Tidak Melanjutkan berhasil diupdate.",
    );
  };

  const toggleSchoolValidation = (schoolId: string) => {
    let schoolName = "Sekolah";
    let nextStatus = "PENDING";
    setState((prev) => {
      const idx = prev.schools.findIndex((s) => s.id === schoolId);
      if (idx === -1) return prev;
      const nowISO = new Date().toISOString();
      const updatedSchools = [...prev.schools];
      nextStatus = updatedSchools[idx].status === "VALID" ? "PENDING" : "VALID";
      schoolName = updatedSchools[idx].name || "Sekolah";
      updatedSchools[idx] = {
        ...updatedSchools[idx],
        status: nextStatus,
        updated_at: nowISO,
      };
      return { ...prev, schools: updatedSchools };
    });
    api.updateSchoolStatus(schoolId, nextStatus).catch(() => {});
    triggerNotification(`Status ${schoolName} diubah menjadi ${nextStatus}`);
  };

  const triggerNotification = (message: string) => {
    setPushNotifications((prev) => [message, ...prev.slice(0, 9)]);
  };

  const clearNotifications = () => setPushNotifications([]);

  return (
    <AppContext.Provider
      value={{
        state,
        loading,
        error,
        activeTab,
        currentDetail,
        selectedSchoolFilter,
        selectedLevelFilter,
        splashActive,
        setActiveTab,
        setCurrentDetail,
        setSelectedSchoolFilter,
        setSelectedLevelFilter,
        finishSplash,
        login,
        logout,
        saveAdmissions,
        savePromotions,
        saveClassGroups,
        saveAlumni,
        saveContinuing,
        saveNonContinuing,
        toggleSchoolValidation,
        pushNotifications,
        triggerNotification,
        clearNotifications,
        refreshState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
