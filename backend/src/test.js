import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const testDb = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to Supabase PostgreSQL");
    const res = await client.query("SELECT NOW()");
    console.log("Server time:", res.rows[0]);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

testDb();