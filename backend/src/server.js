import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected");
    client.release();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect database", error);
    process.exit(1);
  }
};

startServer();
