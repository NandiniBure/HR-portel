import db from "../config/db.js";
import { getAttendanceByEmployee } from "../controllers/attendanceController.js";

const AttendanceModel = {
  async createAttendance(employee_id, date, check_in_time) {
    const query = `
      INSERT INTO attendance (
        employee_id,
        date,
        check_in_time,
        status,
        created_at
      )
      VALUES (
        $1,
        $2::date,
        $3::timestamp,
        CASE 
          WHEN ($3::timestamp)::time > TIME '12:00:00'
            THEN 'HALF_DAY'
          ELSE 'PRESENT'
        END,
        NOW()
      )
      RETURNING *;
    `;

    const values = [employee_id, date, check_in_time];

    const result = await db.query(query, values);
    return result.rows[0];
  },
  async getAttendanceDetailsByEmployee(employee_id, date) {
    const query = `
      SELECT 
        a.id AS "attendanceId",
        e.id AS "employeeId",
        e.user_id AS "userId",
        e.first_name AS "firstName",
        e.last_name AS "lastName",
  
        a.date AS "date",
        a.check_in_time AS "checkInTime",
        a.check_out_time AS "checkOutTime",
        a.status AS "status"
  
      FROM attendance a
      JOIN employees e 
        ON a.employee_id = e.id
  
      WHERE a.employee_id = $1
        AND a.date = $2
    `;

    const result = await db.query(query, [employee_id, date]);
    return result.rows[0]; // 👈 single record
  },
  async updateCheckOut(id, check_out_time, status) {
    console.log(id, check_out_time, status);
    const query = `
      UPDATE attendance
      SET check_out_time = $1, status = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await db.query(query, [check_out_time, status, id]);
    return result.rows[0];
  },
  async getAttendanceByEmployee(employeeId) {
    const query = `
      SELECT 
        id AS attendance_id,
        employee_id,
        date,
        check_in_time,
        check_out_time,
        status,
        created_at
      FROM attendance
      WHERE employee_id = $1
        AND date <= CURRENT_DATE
      ORDER BY date DESC, check_in_time DESC;
    `;

    const result = await db.query(query, [employeeId]);

    return result.rows.map((row) => ({
      attendance_id: row.attendance_id,
      employee_id: row.employee_id,
      date: row.date,
      check_in_time: row.check_in_time,
      check_out_time: row.check_out_time,
      status: row.status,
      created_at: row.created_at,
    }));
  },
  async getAllAttendance(date, search) {
    const queryDate = date || new Date().toISOString().split("T")[0];

    let query = `
      WITH attendance_data AS (
        SELECT 
          e.id AS "employeeId",
          e.user_id AS "userId",
          e.first_name AS "firstName",
          e.last_name AS "lastName",
  
          a.id AS "attendanceId",
          a.date AS "date",
          a.check_in_time AS "checkInTime",
          a.check_out_time AS "checkOutTime",
  
          l.start_date AS "leaveStartDate",
          l.end_date AS "leaveEndDate",
  
          CASE
            WHEN l.start_date IS NOT NULL THEN 'LEAVE'
            WHEN a.id IS NULL THEN 'ABSENT'
            WHEN a.check_out_time IS NULL THEN 'HALF_DAY'
            WHEN a.check_in_time::time > '12:00:00'
              OR a.check_out_time::time < '16:00:00'
            THEN 'HALF_DAY'
            ELSE 'PRESENT'
          END AS "status"
  
        FROM employees e
  
        LEFT JOIN attendance a
          ON a.employee_id = e.id
          AND a.date = $1
  
        LEFT JOIN LATERAL (
          SELECT l.start_date, l.end_date
          FROM leaves l
          WHERE l.employee_id = e.id
            AND LOWER(l.status) = 'approved'
            AND $1 BETWEEN l.start_date AND l.end_date
          LIMIT 1
        ) l ON true
  
        WHERE e.is_active = true
    `;

    const values = [queryDate];

    // ✅ Add search filter here
    if (search) {
      query += `
        AND LOWER(e.first_name || ' ' || e.last_name) LIKE LOWER($2)
      `;
      values.push(`%${search}%`);
    }

    query += `
      ),
  
      monthly_company_stats AS (
        SELECT 
          COUNT(DISTINCT e.id) AS "totalEmployees",
  
          COUNT(a.id) FILTER (
            WHERE a.date >= date_trunc('month', CURRENT_DATE)
            AND a.date <= CURRENT_DATE
            AND a.check_in_time IS NOT NULL
          ) AS "totalPresentDays",
  
          (COUNT(DISTINCT e.id) * EXTRACT(DAY FROM CURRENT_DATE)) 
            AS "totalWorkingDays"
  
        FROM employees e
        LEFT JOIN attendance a ON a.employee_id = e.id
        WHERE e.is_active = true
      )
  
      SELECT 
        ad.*,
  
        COUNT(*) FILTER (WHERE ad.status = 'PRESENT') OVER() AS "presentCount",
        COUNT(*) FILTER (WHERE ad.status = 'ABSENT') OVER() AS "absentCount",
        COUNT(*) FILTER (WHERE ad.status = 'HALF_DAY') OVER() AS "halfDayCount",
        COUNT(*) FILTER (WHERE ad.status = 'LEAVE') OVER() AS "leaveCount",
  
        ms."totalEmployees",
        ms."totalPresentDays",
        ms."totalWorkingDays",
  
        CASE 
          WHEN ms."totalWorkingDays" = 0 THEN 0
          ELSE ROUND((ms."totalPresentDays"::decimal / ms."totalWorkingDays") * 100, 2)
        END AS "attendanceRate"
  
      FROM attendance_data ad
      CROSS JOIN monthly_company_stats ms
  
      ORDER BY ad."employeeId";
    `;

    const result = await db.query(query, values);
    const rows = result.rows;

    return {
      counts: rows.length
        ? {
            present: Number(rows[0].presentCount),
            absent: Number(rows[0].absentCount),
            halfDay: Number(rows[0].halfDayCount),
            leave: Number(rows[0].leaveCount),
          }
        : {
            present: 0,
            absent: 0,
            halfDay: 0,
            leave: 0,
          },

      attendanceRate: rows.length ? Number(rows[0].attendanceRate) : 0,

      data: rows.map((row) => ({
        employeeId: row.employeeId,
        userId: row.userId,
        name: `${row.firstName} ${row.lastName}`,

        date: row.date || queryDate,
        checkInTime: row.checkInTime,
        checkOutTime: row.checkOutTime,

        leaveStartDate: row.leaveStartDate,
        leaveEndDate: row.leaveEndDate,

        status: row.status,
      })),
    };
  },
  async updateStatus(id, status) {
    const query = `
      UPDATE attendance
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  },
  async deleteAttendance(id) {
    const query = `
      DELETE FROM attendance
      WHERE id = $1
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};

export default AttendanceModel;
