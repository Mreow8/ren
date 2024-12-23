const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables from .env file

// Using the full connection URL provided by Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false, // SSL config for Render
});
console.log(process.env.DATABASE_URL);
console.log(process.env.DB_SSL);

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database on Render.");
});

pool.on("error", (err) => {
  console.error("Error with PostgreSQL connection:", err);
});

module.exports = pool;
