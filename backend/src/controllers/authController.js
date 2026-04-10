import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { registerUser, findUserByEmail } from "../services/authService.js";
import db from "../config/db.js";

export const signup = async (req, res) => {
  try {
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
    } = req.body;

    // check if user already exists
    const existingUser = await db.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // start transaction
    await db.query("BEGIN");

    // create user
    const userResult = await db.query(
      `
      INSERT INTO users (
        name,
        email,
        password,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
      `,
      [name, email, hashedPassword, role]
    );

    const user = userResult.rows[0];

    // create employee
    const employeeResult = await db.query(
      `
      INSERT INTO employees (
        user_id,
        first_name,
        last_name,
        department_id,
        designation_id,
        joining_date,
        employment_type,
        salary
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
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

    // initialize leave balances for this employee
    await db.query(
      `
      INSERT INTO leave_balances (
        employee_id,
        leave_type_id,
        year,
        allocated_days,
        used_days,
        remaining_days
      )
      SELECT
        $1,
        lt.id,
        EXTRACT(YEAR FROM CURRENT_DATE)::INT,
        lt.max_days_per_year,
        0,
        lt.max_days_per_year
      FROM leave_types lt
      WHERE lt.code IN ('SL', 'CL', 'EL', 'ML', 'PL')
      `,
      [employee.id]
    );

    // commit transaction
    await db.query("COMMIT");

    return res.status(201).json({
      message: "User created successfully",
      user,
      employee,
    });
  } catch (error) {
    await db.query("ROLLBACK");

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) return res.status(401).json({ message: "User not found" });

    // Debugging why user password is not matching
    console.log("User password from DB (hashed):", user.password);
    console.log("Password submitted:", password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error("Password mismatch. Hash check failed.");
    } else {
      console.log("Password matched.");
    }

    if (!isMatch) return res.status(401).json({ message: "Invalid password" });


    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out",
  });
};
