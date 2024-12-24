const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth");

const pool = require("./config/db");

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
