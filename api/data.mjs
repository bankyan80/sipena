import { getDb } from "./_db.js";

const ALLOWED_TABLES = {
  schools: "schools",
  student_admissions: "student_admissions",
  student_promotions: "student_promotions",
  class_groups: "class_groups",
  alumni: "alumni",
  continuing_students: "continuing_students",
  non_continuing_students: "non_continuing_students",
};

function error(res, status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function ok(res, data) {
  return new Response(JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? Number(value) : value
  ), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const table = url.searchParams.get("table");
  const schoolId = url.searchParams.get("schoolId");

  if (!table || !ALLOWED_TABLES[table]) {
    return error(null, 400, "Invalid or missing 'table' parameter");
  }

  try {
    const db = getDb();
    let sql = `SELECT * FROM ${table}`;
    const args = [];

    if (schoolId) {
      sql += ` WHERE school_id = ?`;
      args.push(schoolId);
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await db.execute({ sql, args });
    return ok(null, result.rows);
  } catch (e) {
    return error(null, 500, e.message);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { table, id, schoolId, year, data } = body;

    if (!table || !ALLOWED_TABLES[table]) {
      return error(null, 400, "Invalid or missing 'table' parameter");
    }

    if (table === "schools") {
      return error(null, 400, "Schools cannot be updated via this endpoint");
    }

    const db = getDb();
    const now = new Date().toISOString();
    const createdBy = data?.created_by || "operator";

    const existing = await db.execute({
      sql: `SELECT id FROM ${table} WHERE school_id = ?`,
      args: [schoolId],
    });

    let result;
    if (existing.rows.length > 0) {
      const existingId = existing.rows[0].id;
      const setClauses = [];
      const updateArgs = [];

      for (const [key, value] of Object.entries(data)) {
        if (key === "id" || key === "school_id" || key === "created_at" || key === "created_by") continue;
        setClauses.push(`${key} = ?`);
        updateArgs.push(value ?? 0);
      }

      setClauses.push("updated_at = ?");
      updateArgs.push(now);
      updateArgs.push(existingId);

      result = await db.execute({
        sql: `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = ?`,
        args: updateArgs,
      });

      // Mark school PENDING after data change
      await db.execute({
        sql: "UPDATE schools SET status = 'PENDING', updated_at = ? WHERE id = ?",
        args: [now, schoolId],
      });
    } else {
      const columns = ["id", "school_id", "year", "created_at", "updated_at", "created_by"];
      const values = [id || `${schoolId}_2026`, schoolId, year || "2026/2027", now, now, createdBy];
      const placeholders = ["?", "?", "?", "?", "?", "?"];

      for (const [key, value] of Object.entries(data)) {
        if (key === "id" || key === "school_id" || key === "year" || key === "created_at" || key === "updated_at" || key === "created_by") continue;
        columns.push(key);
        values.push(value ?? 0);
        placeholders.push("?");
      }

      result = await db.execute({
        sql: `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
        args: values,
      });

      // Mark school PENDING
      await db.execute({
        sql: "UPDATE schools SET status = 'PENDING', updated_at = ? WHERE id = ?",
        args: [now, schoolId],
      });
    }

    return ok(null, { success: true, lastInsertRowid: result.lastInsertRowid });
  } catch (e) {
    return error(null, 500, e.message);
  }
}

export async function PUT(req) {
  const body = await req.json();
  const { schoolId, status } = body;

  if (!schoolId || !status) {
    return error(null, 400, "Missing schoolId or status");
  }

  try {
    const db = getDb();
    const now = new Date().toISOString();
    await db.execute({
      sql: "UPDATE schools SET status = ?, updated_at = ? WHERE id = ?",
      args: [status, now, schoolId],
    });
    return ok(null, { success: true });
  } catch (e) {
    return error(null, 500, e.message);
  }
}
