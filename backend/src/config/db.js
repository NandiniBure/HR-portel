import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

// Use DATABASE_URL from Supabase
const pool = new Pool({
  connectionString:"postgresql://postgres.sjpgdarrioapzgdgldft:NandiniBure%23123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to Supabase PostgreSQL");
    client.release();
  })
  .catch((err) => console.error("❌ Connection error", err));

export default pool;
