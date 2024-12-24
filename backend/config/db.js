const { Pool } = require("pg");

const connectionOptions = {
  connectionString:
    "postgresql://rem_p4tm_user:Tu6m6KfFKADijl8ubmAYrHoxIkbDbCC0@dpg-ctg0cat2ng1s738oeq9g-a.singapore-postgres.render.com/rem_p4tm",
  ssl: {
    rejectUnauthorized: false, // Required for Render's PostgreSQL
  },
};

// Debugging: Log the connection options
console.log("Connection Options:", connectionOptions);

const pool = new Pool(connectionOptions);

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database successfully.");
});

pool.on("error", (err) => {
  console.error("Error with PostgreSQL connection:", err);
});

module.exports = pool;
