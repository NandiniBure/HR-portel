import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const registerUser = async (data) => {
  const {
    name,
    email,
    password,
    role,
    first_name,
    last_name,
    department_id,
    designation_id,
    joining_date,
    employment_type,
    salary,
  } = data;
  console.log(data)
  console.log("Hellooo")

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hellooo")

  // Create user
  const userResult = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, hashedPassword, role]
  );
  const user = userResult.rows[0];

  console.log({
    sid: user?.id,
    first_name,
    last_name,
    department_id,
    designation_id,
    joining_date,
    employment_type,
    salary,
  });
  // Create employee
  const employeeResult = await db.query(
    `INSERT INTO employees (
      user_id,
      first_name,
      last_name,
      department_id,
      designation_id,
      joining_date,
      employment_type,
      salary
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      user.id,
      first_name,
      last_name,
      department_id,
      designation_id,
      joining_date,
      employment_type,
      salary,
    ]
  );

  const employee = employeeResult.rows[0];

  return { user, employee };
};
export const findUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);

  return result.rows[0];
};
