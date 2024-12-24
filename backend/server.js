// backend/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
