export interface AuditTrail {
  created_at: string; // ISO String
  updated_at: string; // ISO String
  created_by: string; // User ID or Name
}

export enum SchoolLevel {
  SD = "SD",
  TK = "TK",
  KB = "KB"
}

export interface School extends AuditTrail {
  id: string; // e.g., "SD_01", "TK_01"
  name: string;
  level: SchoolLevel;
  address: string;
  status: "VALID" | "PENDING"; // Validation Status by Admin Kecamatan
}

export enum UserRole {
  PUBLIK = "PUBLIK",
  OPERATOR = "OPERATOR",
  ADMIN = "ADMIN"
}

export interface User extends AuditTrail {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  schoolId?: string; // For Operator role
}

// 1. Student Admissions (Pendataan Siswa Baru)
// Tab: Domisili, Afirmasi, Mutasi
// No student names, only counts (L, P, Total)
export interface AdmissionData {
  l: number;
  p: number;
}

export interface StudentAdmissions extends AuditTrail {
  id: string; // schoolId_year
  schoolId: string;
  year: string; // e.g. "2026/2027"
  domisili: AdmissionData;
  afirmasi: AdmissionData;
  mutasi: AdmissionData;
}

// 2. Student Promotions (Kenaikan Siswa)
// Tab: SD, TK, KB
// SD: Kelas I -> II, II -> III, III -> IV, IV -> V, V -> VI
// TK: Kelompok A -> Kelompok B
// KB: Kelompok Bermain -> Kelompok Lanjutan
export interface PromotionStage {
  l: number;
  p: number;
}

export interface StudentPromotions extends AuditTrail {
  id: string; // schoolId_year
  schoolId: string;
  year: string; // "2026/2027"
  // SD stages
  sd_1_to_2?: PromotionStage;
  sd_2_to_3?: PromotionStage;
  sd_3_to_4?: PromotionStage;
  sd_4_to_5?: PromotionStage;
  sd_5_to_6?: PromotionStage;
  // TK stages
  tk_a_to_b?: PromotionStage;
  // KB stages
  kb_play_to_cont?: PromotionStage;
}

// 3. Class Groups (Jumlah Rombel)
// Tab: SD, TK, KB
// Counts of rombel (classes) for each grade
export interface ClassGroups extends AuditTrail {
  id: string; // schoolId_year
  schoolId: string;
  year: string;
  // SD (Grade 1 - 6)
  sd_g1: number;
  sd_g2: number;
  sd_g3: number;
  sd_g4: number;
  sd_g5: number;
  sd_g6: number;
  // TK (A and B)
  tk_a: number;
  tk_b: number;
  // KB (Playgroup and Continued)
  kb_play: number;
  kb_cont: number;
}

// 4. Alumni (Data Alumni)
// Card besar: L, P, Total
// Rekap alumni TP 2025/2026
export interface Alumni extends AuditTrail {
  id: string;
  schoolId: string;
  year: string; // "2025/2026"
  l: number;
  p: number;
}

// 5. Continuing Students (Data Siswa Melanjutkan)
// Card: L, P, Total with Progress Bar (Percentage)
export interface ContinuingStudents extends AuditTrail {
  id: string;
  schoolId: string;
  year: string; // "2026/2027"
  l: number;
  p: number;
}

// 6. Non-Continuing Students (Data Siswa Tidak Melanjutkan)
// Card: L, P, Total with Progress Bar (Percentage)
export interface NonContinuingStudents extends AuditTrail {
  id: string;
  schoolId: string;
  year: string; // "2026/2027"
  l: number;
  p: number;
}
