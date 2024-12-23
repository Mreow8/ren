const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const path = require("path");

// Set up PostgreSQL client
const db = new Client({
  connectionString: process.env.DATABASE_URL,
});

db.connect();

router.get("/api/products", (req, res) => {
  const storeId = req.query.storeId;
  let query = `
    SELECT products.*, sellers.store_name, sellers.image AS seller_image, sellers.region, sellers.province
    FROM products
    INNER JOIN sellers ON products.store_id = sellers.store_id
  `;
  const queryParams = [];

  if (storeId) {
    query += " WHERE sellers.store_id = $1";
    queryParams.push(storeId);
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error("Error retrieving products from the database:", error);
      return res.status(500).json({ message: "Error retrieving products." });
    }

    const productsWithPaths = results.rows.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `http://:${process.env.PORT}/uploads/${product.product_image}`
        : null,
    }));

    res.status(200).json(productsWithPaths);
  });
});

router.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const query = `
    SELECT products.*, sellers.store_name, sellers.province, sellers.image AS seller_image
    FROM products
    INNER JOIN sellers ON sellers.store_id = products.store_id
    WHERE id = $1
  `;
  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error("Error retrieving product:", error);
      return res.status(500).json({ message: "Error retrieving product" });
    }

    if (results.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Product not found for ID: ${productId}` });
    }

    const product = {
      ...results.rows[0],
      product_image: results.rows[0].product_image
        ? `http://localhost:${process.env.PORT}/uploads/${results.rows[0].product_image}`
        : null,
      seller_image: results.rows[0].seller_image
        ? `http://localhost:${process.env.PORT}/seller_images/${results.rows[0].seller_image}`
        : null,
    };

    res.json(product);
  });
});

// Add more product-related routes here (e.g., DELETE route)

module.exports = router;
