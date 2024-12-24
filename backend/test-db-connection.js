// test-db-connection.js
const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection test failed:", err);
  } else {
    console.log("Database connection test successful:", res.rows[0]);
  }
  pool.end(); // Close the database connection
});
