const { Pool } = require("pg");
require("dotenv").config(); // Ensure environment variables are loaded

// Use the database URL directly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the URL from your environment variables
  ssl: { rejectUnauthorized: false }, // Ensure SSL is used as Render requires it
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
