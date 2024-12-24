const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const pool = require("./config/db");

const app = express();

// Ensure the port is dynamically set from the environment variable
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder inside rem-react
app.use(express.static(path.join(__dirname, "../rem-react/public"))); // Adjust path to point to public folder

// Serve home.html as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../rem-react/src/html", "home.html"));
});

// Test the database connection
pool
  .connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to the PostgreSQL database:", err.stack);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
