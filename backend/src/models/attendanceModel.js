import db from "../config/db.js";

const AttendanceModel = {
  async createAttendance(employee_id, date, check_in_time, status) {
    const query = `
      INSERT INTO attendance (employee_id, date, check_in_time, status, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const values = [employee_id, date, check_in_time, status];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByEmployeeAndDate(employee_id, date) {
    const query = `
      SELECT * FROM attendance
      WHERE employee_id = $1 AND date = $2;
    `;
    const result = await db.query(query, [employee_id, date]);
    return result.rows[0];
  },

  async updateCheckOut(id, check_out_time, status) {
    const query = `
      UPDATE attendance
      SET check_out_time = $1, status = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await db.query(query, [check_out_time, status, id]);
    return result.rows[0];
  },

  async getAttendanceByEmployee(employee_id) {
    const query = `
      SELECT * FROM attendance
      WHERE employee_id = $1
      ORDER BY date DESC;
    `;
    const result = await db.query(query, [employee_id]);
    return result.rows;
  },

  async getAllAttendance() {
    const query = `
      SELECT a.*, e.user_id
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ORDER BY a.date DESC;
    `;
    const result = await db.query(query);
    return result.rows;
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
