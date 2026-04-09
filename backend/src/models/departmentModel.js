import db from "../config/db.js";

export const createDepartment = async (name, description) => {
  const result = await db.query(
    `INSERT INTO departments (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );
  return result.rows[0];
};

export const getDepartments = async () => {
  const result = await db.query(`SELECT * FROM departments ORDER BY id DESC`);
  return result.rows;
};