import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/products.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Nav from "./nav";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle state for menu
  const navigate = useNavigate();
  const [sellerStoreName, setSellerStoreName] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch("https://rem-rcmr.onrender.com/api/products"),
          fetch("https://rem-rcmr.onrender.com/api/categories"),
        ]);
        if (!productRes.ok || !categoryRes.ok) {
          throw new Error("Error fetching data");
        }
        setProducts(await productRes.json());
        setCategories(await categoryRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    navigate("/login");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "" || product.category === selectedCategory) && // Filter by category
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
  );

  if (loading) {
    return <div className="loading-message">Loading products...</div>; // Loading state
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName); // Set selected category
  };

  return (
    <div className="product-list" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Nav
        username={username}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        storeName={sellerStoreName}
      />
      <div id="categories-container">
        <ul className="categories-list">
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className="category-item"
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="container">
        <div className="products-container">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const imageUrl = product.product_image || "placeholder_image.png";

              console.log("Image URL:", imageUrl);
              return (
                <Link
                  to={`/product_desc/${product.id}`}
                  key={product.id}
                  className="product-item"
                >
                  <img
                    src={imageUrl}
                    alt={product.product_name || "Product Image"}
                    className="product-image"
                  />
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-price">Php {product.product_price}</p>
                </Link>
              );
            })
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
