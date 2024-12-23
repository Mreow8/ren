const express = require("express");
const router = express.Router();
const { db } = require("../config/db"); // Assuming db is using 'pg' client

// Route to add item to cart
router.post("/api/cart", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res
      .status(400)
      .json({ message: "User ID, product ID, and quantity are required." });
  }

  const query = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET quantity = cart.quantity + $3
  `;

  db.query(query, [user_id, product_id, quantity], (error, results) => {
    if (error) {
      console.error("Error adding item to cart:", error);
      return res.status(500).json({ message: "Error adding item to cart" });
    }

    res.status(200).json({ message: "Item added to cart successfully!" });
  });
});

// Route to get cart items with product details
router.get("/api/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT products.product_name, products.product_price, products.product_image,
           cart.quantity, sellers.store_name AS seller_username, cart.product_id
    FROM cart
    JOIN products ON cart.product_id = products.id
    JOIN sellers ON products.store_id = sellers.store_id
    WHERE cart.user_id = $1
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving cart items:", error);
      return res.status(500).json({ message: "Error retrieving cart items" });
    }

    const productsWithImages = results.rows.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `https://rem-rcmr.onrender.com/uploads/${product.product_image}`
        : "placeholder_image.png", // Default image
    }));

    res.status(200).json(productsWithImages);
  });
});

module.exports = router;
