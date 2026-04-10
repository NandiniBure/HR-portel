import db from "../config/db.js";

export const getDepartments = async () => {
  const result = await db.query(`
    SELECT
      id AS "id",
      name AS "name",
      description AS "description",
      created_at AS "createdAt"
    FROM departments
    ORDER BY name ASC
  `);

  return result.rows;
};

export const getDesignations = async () => {
  const result = await db.query(`
    SELECT
      id AS "id",
      title AS "title",
      level AS "level",
      created_at AS "createdAt"
    FROM designations
    ORDER BY level ASC, title ASC
  `);

  return result.rows;
};
