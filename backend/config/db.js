const { Pool } = require("pg");
require("dotenv").config();  // Load environment variables from .env file

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false, // SSL config for Render
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database on Render.");
});

pool.on("error", (err) => {
  console.error("Error with PostgreSQL connection:", err);
});

module.exports = pool;
