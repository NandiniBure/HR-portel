import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import db from "../config/db.js";

// ================= SIGNUP =================
export const signup = async (req, res) => {
  let transactionStarted = false;

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

    // ✅ Validate required fields
    if (!email || !password || !first_name) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // ✅ Check if user exists
    const existingUser = await db.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Start transaction
    await db.query("BEGIN");
    transactionStarted = true;

    // ✅ Create user
    const userResult = await db.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
      `,
      [name, email, hashedPassword, role]
    );

    const user = userResult.rows[0];

    // ✅ Create employee
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
        department_id || null,
        designation_id || null,
        joining_date || null,
        employment_type || null,
        salary || 0,
      ]
    );

    const employee = employeeResult.rows[0];

    // ✅ Initialize leave balances
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

    // ✅ Commit
    await db.query("COMMIT");

    return res.status(201).json({
      message: "User created successfully",
      user,
      employee,
    });
  } catch (error) {
    // ✅ Safe rollback
    if (transactionStarted) {
      await db.query("ROLLBACK");
    }

    console.error("Signup Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Fetch user WITH password
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ================= REFRESH TOKEN =================
export const refreshToken = (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      return res.json({ accessToken });
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ================= LOGOUT =================
export const logout = (req, res) => {
  // res.clearCookie("refreshToken");

  return res.json({
    message: "Logged out",
  });
};
