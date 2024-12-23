const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/db"); // PostgreSQL connection pool

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth");

const app = express();

// Ensure that the port is dynamically set from the environment variable
const PORT = process.env.PORT || 3001;

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

// Test the database connection
db.connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to the PostgreSQL database:", err.stack);
  });

// Start the server, binding to the correct port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
