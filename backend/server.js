const path = require("path"); // Import path module first
require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); // Load .env file

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth");

const app = express();

// Ensure the port is dynamically set from the environment variable
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

// PostgreSQL Database Connection (Example using pg-pool)
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL from .env
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false, // SSL config for Render
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
