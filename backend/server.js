const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Optional, if needed

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "../rem-react/build")));

// Serve the React app for all routes (this serves index.html on any non-API route)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../rem-react/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
