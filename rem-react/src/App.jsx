import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./html/home"; // Adjust the path as necessary

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route for Home */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
