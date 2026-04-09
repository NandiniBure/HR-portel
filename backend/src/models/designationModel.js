import db from "../config/db.js";

export const createDesignation = async (title, level) => {
  const result = await db.query(
    `INSERT INTO designations (title, level)
     VALUES ($1, $2)
     RETURNING *`,
    [title, level]
  );
  return result.rows[0];
};

export const getDesignations = async () => {
  const result = await db.query(`SELECT * FROM designations ORDER BY id DESC`);
  return result.rows;
};
