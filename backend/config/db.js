const { Pool } = require("pg");
require("dotenv").config(); // Ensure environment variables are loaded

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false, // SSL configuration
});

// Optionally, you can listen for connection events
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err, client) => {
  console.error("Error in PostgreSQL pool", err);
});

// Export the pool to be used in other modules
module.exports = pool;
