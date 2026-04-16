import db from "../config/db.js";

export const getEmployeeByUserId = async (userId) => {
  const result = await db.query(
    `SELECT 
      e.id AS "employeeId",
      e.first_name || ' ' || e.last_name AS "employeeName"
     FROM employees e
     WHERE e.user_id = $1`,
    [userId]
  );

  return result.rows[0];
};

export const createLeave = async ({
  employeeId,
  leaveTypeId,
  startDate,
  endDate,
  startSession = "FULL",
  endSession = "FULL",
  totalDays,
  reason,
}) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Insert leave
    const leaveResult = await client.query(
      `INSERT INTO leaves (
         employee_id,
         leave_type_id,
         start_date,
         end_date,
         start_session,
         end_session,
         total_days,
         reason,
         status,
         applied_at,
         updated_at
       )
       VALUES (
         $1,
         $2,
         $3,
         $4,
         $5,
         $6,
         $7,
         $8,
         'PENDING',
         CURRENT_TIMESTAMP,
         CURRENT_TIMESTAMP
       )
       RETURNING
         id AS "leaveId",
         employee_id AS "employeeId",
         leave_type_id AS "leaveTypeId",
         start_date AS "startDate",
         end_date AS "endDate",
         start_session AS "startSession",
         end_session AS "endSession",
         total_days AS "totalDays",
         reason AS "reason",
         status AS "status",
         applied_at AS "appliedAt"`,
      [
        employeeId,
        leaveTypeId,
        startDate,
        endDate,
        startSession,
        endSession,
        totalDays,
        reason,
      ]
    );

    const leave = leaveResult.rows[0];

    // Insert approval history
    await client.query(
      `INSERT INTO leave_approval_history (
         leave_id,
         action,
         acted_by,
         comment,
         acted_at
       )
       VALUES ($1, 'PENDING', $2, $3, CURRENT_TIMESTAMP)`,
      [leave.leaveId, employeeId, reason || "Leave applied"]
    );

    await client.query("COMMIT");
    console.log(leave);
    return leave;
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(`Create Leave Error: ${error.message}`);
  } finally {
    client.release();
  }
};

export const fetchMyLeaves = async (userId) => {
  const result = await db.query(
    `SELECT
      l.id AS "leaveId",
      lt.id AS "leaveTypeId",
      lt.name AS "leaveType",
      lt.code AS "leaveCode",
      l.start_date AS "startDate",
      l.end_date AS "endDate",
      l.start_session AS "startSession",
      l.end_session AS "endSession",
      l.total_days AS "totalDays",
      l.reason AS "reason",
      l.status AS "status",
      l.rejection_reason AS "rejectionReason",
      l.applied_at AS "appliedAt",
      l.approved_at AS "approvedAt",
      approver.first_name || ' ' || approver.last_name AS "approvedByName"
    FROM leaves l
    JOIN employees e
      ON l.employee_id = e.id
    JOIN leave_types lt
      ON l.leave_type_id = lt.id
    LEFT JOIN employees approver
      ON l.approved_by = approver.id
    WHERE e.user_id = $1
    ORDER BY l.applied_at DESC`,
    [userId]
  );

  return result.rows;
};

export const fetchAllLeaves = async (filter = {}) => {
  let query = `
    SELECT
      l.id AS "leaveId",
      l.employee_id AS "employeeId",
      emp.first_name || ' ' || emp.last_name AS "employeeName",
      lt.id AS "leaveTypeId",
      lt.name AS "leaveType",
      lt.code AS "leaveCode",
      l.start_date AS "startDate",
      l.end_date AS "endDate",
      l.start_session AS "startSession",
      l.end_session AS "endSession",
      l.total_days AS "totalDays",
      l.reason AS "reason",
      l.status AS "status",
      l.rejection_reason AS "rejectionReason",
      l.applied_at AS "appliedAt",
      l.approved_at AS "approvedAt",
      approver.first_name || ' ' || approver.last_name AS "approvedByName"
    FROM leaves l
    JOIN employees emp
      ON l.employee_id = emp.id
    JOIN leave_types lt
      ON l.leave_type_id = lt.id
    LEFT JOIN employees approver
      ON l.approved_by = approver.id
  `;

  const values = [];
  const whereClauses = [];

  // 🔹 Status filter
  if (filter.status) {
    values.push(filter.status);
    whereClauses.push(`l.status = $${values.length}`);
  }

  // 🔹 Overlap date (existing logic)
  if (filter.overlapsDate) {
    values.push(filter.overlapsDate);
    whereClauses.push(`
      l.start_date <= $${values.length}
      AND l.end_date >= $${values.length}
    `);
  }

  // 🔹 Employee ID
  if (filter.employeeId) {
    values.push(filter.employeeId);
    whereClauses.push(`l.employee_id = $${values.length}`);
  }

  // 🔹 NEW: Date range filter
  if (filter.dateRange) {
    const { fromDate, toDate } = filter.dateRange;

    if (fromDate) {
      values.push(fromDate);
      whereClauses.push(`l.start_date >= $${values.length}`);
    }

    if (toDate) {
      values.push(toDate);
      whereClauses.push(`l.end_date <= $${values.length}`);
    }
  }

  // 🔹 NEW: Employee name search
  if (filter.employeeName) {
    values.push(`%${filter.employeeName}%`);
    whereClauses.push(`
      LOWER(emp.first_name || ' ' || emp.last_name) LIKE LOWER($${values.length})
    `);
  }

  // 🔹 Apply WHERE
  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  query += ` ORDER BY l.applied_at DESC`;

  const result = await db.query(query, values);

  return result.rows;
};

export const updateLeaveStatusDB = async ({
  leaveId,
  status,
  approvedBy,
  rejectionReason = null,
}) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Fetch the leave details
    const leaveRes = await client.query(
      `SELECT
         id AS "leaveId",
         employee_id AS "employeeId",
         leave_type_id AS "leaveTypeId",
         total_days AS "totalDays",
         status AS "currentStatus",
         start_date,
         end_date,
         EXTRACT(YEAR FROM start_date)::int AS "year"
       FROM leaves
       WHERE id = $1
       FOR UPDATE`,
      [leaveId]
    );

    const leave = leaveRes.rows[0];
    if (!leave) throw new Error("Leave not found");

    /**
     * 🔥 CRITICAL FIX — convert DATE to string to avoid timezone shift
     */
    const startDate = leave.start_date.toISOString().split("T")[0];
    const endDate = leave.end_date.toISOString().split("T")[0];

    const normalizedStatus = status?.trim()?.toUpperCase();
    const validActions = ["APPROVED", "REJECTED", "CANCELLED", "PENDING"];

    if (!validActions.includes(normalizedStatus)) {
      throw new Error(
        `Invalid leave status: ${status}. Must be one of: ${validActions.join(
          ", "
        )}`
      );
    }

    // Update leave status
    const updateResult = await client.query(
      `UPDATE leaves
       SET
         status = $1,
         approved_by = $2,
         approved_at = CURRENT_TIMESTAMP,
         rejection_reason = $3,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING
         id AS "leaveId",
         status AS "status",
         approved_by AS "approvedBy",
         approved_at AS "approvedAt",
         rejection_reason AS "rejectionReason"`,
      [normalizedStatus, approvedBy, rejectionReason, leaveId]
    );

    /**
     * =========================================================
     * CASE 1: PENDING → APPROVED
     * Deduct balance + Insert LEAVE in attendance
     * =========================================================
     */
    if (
      normalizedStatus === "APPROVED" &&
      leave.currentStatus?.trim()?.toUpperCase() !== "APPROVED"
    ) {
      // Deduct leave balance
      await client.query(
        `UPDATE leave_balances
         SET
           used_days = used_days + $1,
           remaining_days = remaining_days - $1,
           updated_at = CURRENT_TIMESTAMP
         WHERE employee_id = $2
           AND leave_type_id = $3
           AND year = $4`,
        [leave.totalDays, leave.employeeId, leave.leaveTypeId, leave.year]
      );

      // Insert LEAVE rows in attendance (timezone-safe)
      await client.query(
        `
        INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, status, created_at)
        SELECT
          $1 AS employee_id,
          gs::date AS date,
          NULL AS check_in_time,
          NULL AS check_out_time,
          'LEAVE' AS status,
          CURRENT_TIMESTAMP
        FROM generate_series($2::date, $3::date, interval '1 day') AS gs
        ON CONFLICT (employee_id, date)
        DO UPDATE SET
          status = 'LEAVE',
          check_in_time = NULL,
          check_out_time = NULL
        `,
        [leave.employeeId, startDate, endDate] // ✅ FIXED
      );
    }

    /**
     * =========================================================
     * CASE 2: APPROVED → REJECTED / CANCELLED
     * Restore balance + Remove LEAVE from attendance
     * =========================================================
     */
    if (
      leave.currentStatus?.trim()?.toUpperCase() === "APPROVED" &&
      normalizedStatus !== "APPROVED"
    ) {
      // Restore leave balance
      await client.query(
        `UPDATE leave_balances
         SET
           used_days = used_days - $1,
           remaining_days = remaining_days + $1,
           updated_at = CURRENT_TIMESTAMP
         WHERE employee_id = $2
           AND leave_type_id = $3
           AND year = $4`,
        [leave.totalDays, leave.employeeId, leave.leaveTypeId, leave.year]
      );

      // Remove LEAVE rows from attendance (timezone-safe)
      await client.query(
        `
        DELETE FROM attendance
        WHERE employee_id = $1
          AND date BETWEEN $2::date AND $3::date
          AND status = 'LEAVE'
        `,
        [leave.employeeId, startDate, endDate] // ✅ FIXED
      );
    }

    // Insert into approval history
    await client.query(
      `INSERT INTO leave_approval_history (
         leave_id,
         action,
         acted_by,
         comment,
         acted_at
       )
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [leaveId, normalizedStatus, approvedBy, rejectionReason]
    );

    await client.query("COMMIT");

    return updateResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteLeaveDB = async (leaveId) => {
  const result = await db.query(
    `DELETE FROM leaves
     WHERE id = $1
     RETURNING
       id AS "leaveId",
       employee_id AS "employeeId",
       leave_type_id AS "leaveTypeId"`,
    [leaveId]
  );

  return result.rows[0];
};

export const fetchLeaveBalances = async (employeeId, year) => {
  const result = await db.query(
    `SELECT
      lb.id AS "balanceId",
      lb.leave_type_id AS "leaveTypeId",
      lt.name AS "leaveType",
      lt.code AS "leaveCode",
      lb.year AS "year",
      lb.allocated_days AS "allocatedDays",
      lb.used_days AS "usedDays",
      lb.remaining_days AS "remainingDays"
    FROM leave_balances lb
    JOIN leave_types lt
      ON lb.leave_type_id = lt.id
    WHERE lb.employee_id = $1
      AND lb.year = $2
    ORDER BY lt.name ASC`,
    [employeeId, year]
  );

  return result.rows;
};

export const insertLeaveApprovalHistory = async ({
  leaveId,
  action,
  actedBy,
  comment,
}) => {
  const result = await db.query(
    `INSERT INTO leave_approval_history (
      leave_id,
      action,
      acted_by,
      comment,
      acted_at
    )
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    RETURNING
      id AS "historyId",
      leave_id AS "leaveId",
      action AS "action",
      acted_by AS "actedBy",
      comment AS "comment",
      acted_at AS "actedAt"`,
    [leaveId, action, actedBy, comment]
  );

  return result.rows[0];
};
