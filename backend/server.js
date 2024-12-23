require("dotenv").config({ path: "../.env" }); // Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/db"); // PostgreSQL connection pool

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/seller_images",
  express.static(path.join(__dirname, "seller_images"))
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(process.env.DB_PASSWORD, typeof process.env.DB_PASSWORD);
  console.log(`Server is running on http://localhost:${PORT}`);
});
