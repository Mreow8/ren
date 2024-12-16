import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [checkedItems, setCheckedItems] = useState([]); // Items selected for the order
  const [totalAmount, setTotalAmount] = useState(0); // Total cost of the order
  const [userDetails, setUserDetails] = useState({}); // User details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  useEffect(() => {
    // When the user leaves "buy now" page
    return () => {
      if (window.location.pathname !== "/buy_now") {
        localStorage.removeItem("checkedItems");
      }
    };
  }, []);

  useEffect(() => {
    // Retrieve necessary data from localStorage
    const storedCheckedItems = JSON.parse(localStorage.getItem("checkedItems"));
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    // Log the retrieved data for debugging purposes
    console.log("Stored Checked Items:", storedCheckedItems);
    console.log("Cart Items:", cartItems);
    console.log("User ID:", userId);
    console.log("Username:", username);

    // Check if all necessary data is available
    if (!storedCheckedItems || !cartItems || !userId) {
      setError("No items selected for checkout or user not logged in.");
      setLoading(false);
      return;
    }

    // Filter items based on the checked state (only include items marked as 'true')
    const itemsToOrder = cartItems.filter(
      (item) =>
        storedCheckedItems[`${item.seller_username}-${item.product_id}`] ===
        true
    );

    if (itemsToOrder.length === 0) {
      setError("No items selected for checkout.");
      setLoading(false);
      return;
    }

    // Fetch product details for each selected item
    const fetchProductDetails = async () => {
      try {
        const productDetailsPromises = itemsToOrder.map(async (item) => {
          const response = await fetch(
            `http://localhost:5000/api/products/${item.product_id}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch details for product ID: ${item.product_id}`
            );
          }
          return response.json();
        });

        const productDetails = await Promise.all(productDetailsPromises);

        // Combine the selected items with their details
        const itemsWithDetails = itemsToOrder.map((item, index) => ({
          ...item,
          productDetails: productDetails[index],
        }));

        // Update state with selected items and total amount
        const total = itemsWithDetails.reduce(
          (sum, item) => sum + parseFloat(item.product_price) * item.quantity,
          0
        );

        setCheckedItems(itemsWithDetails);
        setTotalAmount(total);
        setUserDetails({ userId, username });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      // Prepare order data
      const orderData = {
        user_id: userDetails.userId,
        items: checkedItems,
        total_amount: totalAmount,
      };

      // Send the order to the backend API
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      // Handle response
      if (!response.ok) {
        throw new Error("Failed to place the order.");
      }

      // Show success message
      alert("Order placed successfully!");

      // Navigate to the order success page
      navigate("/order_success");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="place-order-container">
      <h1>Place Your Order</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div>
          <h2>Order Summary</h2>
          <div className="order-items">
            {checkedItems.map((item) => (
              <div key={item.product_id} className="order-item">
                <img
                  src={item.productDetails.product_image}
                  alt={item.productDetails.product_name}
                  style={{ width: "80px", height: "80px" }}
                />
                <div>
                  <p>{item.productDetails.product_name}</p>
                  <p>
                    Php{" "}
                    {isNaN(item.productDetails.product_price)
                      ? "Invalid Price"
                      : parseFloat(item.productDetails.product_price).toFixed(
                          2
                        )}
                    x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <h3>Total: Php {totalAmount.toFixed(2)}</h3>
          <button className="btn btn-primary" onClick={handlePlaceOrder}>
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
