import db from "../config/db.js";

const createEmployee = async (employee) => {
  const {
    user_id,
    first_name,
    last_name,
    phone,
    address,
    date_of_birth,
    joining_date,
    department_id,
    designation_id,
    manager_id,
    employment_type,
    salary,
  } = employee;

  const result = await db.query(
    `INSERT INTO employees (
      user_id,
      first_name,
      last_name,
      phone,
      address,
      date_of_birth,
      joining_date,
      department_id,
      designation_id,
      manager_id,
      employment_type,
      salary
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
    [
      user_id,
      first_name,
      last_name,
      phone,
      address,
      date_of_birth,
      joining_date,
      department_id,
      designation_id,
      manager_id,
      employment_type,
      salary,
    ]
  );

  return result.rows[0];
};
const getEmployees = async (filters = {}) => {
  const { search, designation, department, joinFrom, joinTo, status } = filters;

  let query = `
    SELECT 
      e.id,
      e.created_at,
      e.first_name,
      e.last_name,
      e.salary,
      e.is_active,
      e.joining_date,

      u.name AS user_name,
      u.email AS user_email,
      u.role AS user_role,

      d.id AS department_id,
      d.name AS department_name,

      des.id AS designation_id,
      des.title AS designation_title

    FROM employees e
    JOIN users u ON e.user_id = u.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN designations des ON e.designation_id = des.id
    WHERE e.is_active IS NOT FALSE
  `;

  const values = [];
  let idx = 1;

  // 🔍 Search
  if (search) {
    query += `
      AND (
        LOWER(e.first_name) LIKE $${idx} OR
        LOWER(e.last_name) LIKE $${idx} OR
        LOWER(u.email) LIKE $${idx}
      )
    `;
    values.push(`%${search.toLowerCase()}%`);
    idx++;
  }

  // 🏷️ Designation
  if (designation) {
    query += ` AND LOWER(des.title) LIKE $${idx}`;
    values.push(`%${designation.toLowerCase()}%`);
    idx++;
  }

  // 🏢 Department
  if (department) {
    query += ` AND LOWER(d.name) LIKE $${idx}`;
    values.push(`%${department.toLowerCase()}%`);
    idx++;
  }

  // 📅 Joining date filters
  if (joinFrom && joinTo) {
    query += ` AND e.joining_date BETWEEN $${idx} AND $${idx + 1}`;
    values.push(joinFrom, joinTo);
    idx += 2;
  } else if (joinFrom) {
    query += ` AND e.joining_date >= $${idx}`;
    values.push(joinFrom);
    idx++;
  } else if (joinTo) {
    query += ` AND e.joining_date <= $${idx}`;
    values.push(joinTo);
    idx++;
  }

  // ✅ Status filter. Accepts "active" or "inactive" (case-insensitive)
  if (typeof status === "string" && status.trim() !== "") {
    const normStatus = status.trim().toLowerCase();
    if (normStatus === "active") {
      query += ` AND e.is_active = TRUE`;
    } else if (normStatus === "inactive") {
      query += ` AND e.is_active = FALSE`;
    }
    // If status is invalid string, ignore
  }

  query += ` ORDER BY e.joining_date DESC`;

  const result = await db.query(query, values);
  return result.rows;
};

const getEmployeeById = async (userId) => {
  console.log(userId);
  const result = await db.query(
    `
    SELECT
      e.id AS employee_id,
      e.created_at,
      e.salary,
      e.is_active,
      e.user_id,
      e.first_name,
      e.last_name,
      e.phone,
      e.address,
      e.date_of_birth,
      e.joining_date,
      e.department_id,
      e.designation_id,
      e.manager_id,
      e.employment_type,

      u.id AS user_id_ref,
      u.name AS user_name,
      u.email AS user_email,
      u.role AS user_role,

      d.id AS department_id_ref,
      d.name AS department_name,
      d.description AS department_description,

      des.id AS designation_id_ref,
      des.title AS designation_title,
      des.level AS designation_level

    FROM employees e
    INNER JOIN users u
      ON e.user_id = u.id
    LEFT JOIN departments d
      ON e.department_id = d.id
    LEFT JOIN designations des
      ON e.designation_id = des.id
    WHERE e.user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0];
};

const updateEmployeeById = async (id, data) => {
  const {
    name,
    email,
    role,
    first_name,
    last_name,
    department_id,
    designation_id,
    salary,
  } = data;

  const employeeResult = await db.query(
    `SELECT * FROM employees WHERE id = $1`,
    [id]
  );

  const employee = employeeResult.rows[0];
  if (!employee) throw new Error("Employee not found");

  // Update user table
  await db.query(
    `UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4`,
    [name, email, role, employee.user_id]
  );

  // Update employee table
  const result = await db.query(
    `UPDATE employees
     SET 
       first_name = $1,
       last_name = $2,
       department_id = $3,
       designation_id = $4,
       salary = $5
     WHERE id = $6
     RETURNING *`,
    [first_name, last_name, department_id, designation_id, salary, id]
  );

  return result.rows[0];
};

const deleteEmployeeById = async (id) => {
  const result = await db.query(
    `UPDATE employees
     SET is_active = false
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

const searchEmployees = async (query) => {
  const result = await db.query(
    `SELECT 
      e.*,
      u.name,
      u.email,
      d.name AS department,
      des.title AS designation

     FROM employees e
     JOIN users u ON e.user_id = u.id
     LEFT JOIN departments d ON e.department_id = d.id
     LEFT JOIN designations des ON e.designation_id = des.id
     WHERE 
        u.name ILIKE $1 OR
        u.email ILIKE $1 OR
        d.name ILIKE $1 OR
        des.title ILIKE $1`,
    [`%${query}%`]
  );

  return result.rows;
};

const filterEmployees = async ({ role, is_active }) => {
  let query = `
    SELECT employees.*, users.name AS user_name, users.email AS user_email, users.role AS user_role
    FROM employees
    JOIN users ON employees.user_id = users.id
    WHERE 1=1
  `;
  const values = [];

  if (role) {
    values.push(role);
    query += ` AND users.role = $${values.length}`;
  }

  if (is_active !== undefined) {
    values.push(is_active);
    query += ` AND employees.is_active = $${values.length}`;
  }

  const result = await db.query(query, values);
  return result.rows;
};

const getEmployeeByUserIdModel = async (userId) => {
  const result = await db.query(`SELECT * FROM employees WHERE user_id = $1`, [
    userId,
  ]);

  return result.rows[0];
};

export {
  createEmployee,
  getEmployees,
  updateEmployeeById,
  deleteEmployeeById,
  getEmployeeById,
  searchEmployees,
  filterEmployees,
  getEmployeeByUserIdModel,
};
