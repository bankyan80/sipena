const API_BASE = "/api/data.mjs";

export const api = {
  async getSchools() {
    const res = await fetch(`${API_BASE}?table=schools`);
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    return rows.map(mapSchool);
  },

  async updateSchoolStatus(schoolId: string, status: string) {
    const res = await fetch(API_BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId, status }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getAdmissions() {
    const res = await fetch(`${API_BASE}?table=student_admissions`);
    const rows = await res.json();
    return rows.map(mapAdmission);
  },

  async saveAdmission(schoolId: string, data: Record<string, number>) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "student_admissions", schoolId, data }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getPromotions() {
    const res = await fetch(`${API_BASE}?table=student_promotions`);
    const rows = await res.json();
    return rows.map(mapPromotion);
  },

  async savePromotion(schoolId: string, data: Record<string, number | null>) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "student_promotions", schoolId, data }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getClassGroups() {
    const res = await fetch(`${API_BASE}?table=class_groups`);
    const rows = await res.json();
    return rows.map(mapClassGroup);
  },

  async saveClassGroup(schoolId: string, data: Record<string, number>) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "class_groups", schoolId, data }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getAlumni() {
    const res = await fetch(`${API_BASE}?table=alumni`);
    const rows = await res.json();
    return rows.map(mapAlumni);
  },

  async saveAlumni(schoolId: string, data: Record<string, number>) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "alumni", schoolId, data }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getContinuing() {
    const res = await fetch(`${API_BASE}?table=continuing_students`);
    const rows = await res.json();
    return rows.map(mapContinuing);
  },

  async saveContinuing(schoolId: string, data: Record<string, number>) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "continuing_students", schoolId, data }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getNonContinuing() {
    const res = await fetch(`${API_BASE}?table=non_continuing_students`);
    const rows = await res.json();
    return rows.map(mapNonContinuing);
  },

  async saveNonContinuing(schoolId: string, data: Record<string, number>) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "non_continuing_students", schoolId, data }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// Mappers from DB column format to app format

function mapSchool(row: any) {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    address: row.address,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
  };
}

function mapAdmission(row: any) {
  return {
    id: row.id,
    schoolId: row.school_id,
    year: row.year,
    domisili: { l: row.domisili_l, p: row.domisili_p },
    afirmasi: { l: row.afirmasi_l, p: row.afirmasi_p },
    mutasi: { l: row.mutasi_l, p: row.mutasi_p },
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
  };
}

function mapPromotion(row: any) {
  return {
    id: row.id,
    schoolId: row.school_id,
    year: row.year,
    sd_1_to_2: row.sd_1_to_2_l != null ? { l: row.sd_1_to_2_l, p: row.sd_1_to_2_p } : undefined,
    sd_2_to_3: row.sd_2_to_3_l != null ? { l: row.sd_2_to_3_l, p: row.sd_2_to_3_p } : undefined,
    sd_3_to_4: row.sd_3_to_4_l != null ? { l: row.sd_3_to_4_l, p: row.sd_3_to_4_p } : undefined,
    sd_4_to_5: row.sd_4_to_5_l != null ? { l: row.sd_4_to_5_l, p: row.sd_4_to_5_p } : undefined,
    sd_5_to_6: row.sd_5_to_6_l != null ? { l: row.sd_5_to_6_l, p: row.sd_5_to_6_p } : undefined,
    tk_a_to_b: row.tk_a_to_b_l != null ? { l: row.tk_a_to_b_l, p: row.tk_a_to_b_p } : undefined,
    kb_play_to_cont: row.kb_play_to_cont_l != null ? { l: row.kb_play_to_cont_l, p: row.kb_play_to_cont_p } : undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
  };
}

function mapClassGroup(row: any) {
  return {
    id: row.id,
    schoolId: row.school_id,
    year: row.year,
    sd_g1: row.sd_g1,
    sd_g2: row.sd_g2,
    sd_g3: row.sd_g3,
    sd_g4: row.sd_g4,
    sd_g5: row.sd_g5,
    sd_g6: row.sd_g6,
    tk_a: row.tk_a,
    tk_b: row.tk_b,
    kb_play: row.kb_play,
    kb_cont: row.kb_cont,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
  };
}

function mapAlumni(row: any) {
  return {
    id: row.id,
    schoolId: row.school_id,
    year: row.year,
    l: row.l,
    p: row.p,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
  };
}

function mapContinuing(row: any) {
  return {
    id: row.id,
    schoolId: row.school_id,
    year: row.year,
    l: row.l,
    p: row.p,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
  };
}

function mapNonContinuing(row: any) {
  return {
    id: row.id,
    schoolId: row.school_id,
    year: row.year,
    l: row.l,
    p: row.p,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
  };
}
