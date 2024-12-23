const express = require("express");
const router = express.Router();
const { db } = require("../config/db");

// Signup route
router.post("/signup", async (req, res) => {
  const { phone, password, username } = req.body;

  if (!phone || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const checkUserQuery = "SELECT * FROM users WHERE username = $1";
    const { rows } = await db.query(checkUserQuery, [username]);

    if (rows.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const insertUserQuery =
      "INSERT INTO users (phone, password, username) VALUES ($1, $2, $3)";
    await db.query(insertUserQuery, [phone, password, username]);

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, phone, and password are required." });
  }

  try {
    const query = `
      SELECT users.*, sellers.store_name, sellers.store_id
      FROM users
      LEFT JOIN sellers ON users.user_id = sellers.user_id
      WHERE users.username = $1 OR users.email = $1 OR users.phone = $1
    `;
    const { rows } = await db.query(query, [identifier]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User does not exist." });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    res.status(200).json({
      message: "Login successful",
      user_id: user.user_id,
      store_name: user.store_name,
      store_id: user.store_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
