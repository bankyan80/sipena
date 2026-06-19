import type {
  School,
  User,
  StudentAdmissions,
  StudentPromotions,
  ClassGroups,
  Alumni,
  ContinuingStudents,
  NonContinuingStudents,
} from "./types";
import { api } from "./api";

export interface AppState {
  schools: School[];
  studentAdmissions: StudentAdmissions[];
  studentPromotions: StudentPromotions[];
  classGroups: ClassGroups[];
  alumni: Alumni[];
  continuingStudents: ContinuingStudents[];
  nonContinuingStudents: NonContinuingStudents[];
  currentUser: User | null;
}

export async function loadState(): Promise<AppState> {
  const [schools, studentAdmissions, studentPromotions, classGroups, alumni, continuingStudents, nonContinuingStudents] =
    await Promise.all([
      api.getSchools(),
      api.getAdmissions(),
      api.getPromotions(),
      api.getClassGroups(),
      api.getAlumni(),
      api.getContinuing(),
      api.getNonContinuing(),
    ]);

  return {
    schools,
    studentAdmissions,
    studentPromotions,
    classGroups,
    alumni,
    continuingStudents,
    nonContinuingStudents,
    currentUser: null,
  };
}
