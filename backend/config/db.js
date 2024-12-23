const { Pool } = require("pg");
require("dotenv").config();

const connectionOptions = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.DB_SSL === "true") {
  connectionOptions.ssl = { rejectUnauthorized: false }; // Necessary for Render
}

const pool = new Pool(connectionOptions);

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database successfully.");
});

pool.on("error", (err) => {
  console.error("Error with PostgreSQL connection:", err);
});

module.exports = pool;
