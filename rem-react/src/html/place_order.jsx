import React, { useState } from "react";

const PlaceOrder = () => {
  const [cartItems] = useState([
    { id: 1, name: "Product 1", price: 50, quantity: 2 },
    { id: 2, name: "Product 2", price: 100, quantity: 1 },
  ]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handlePlaceOrder = () => {
    if (!deliveryAddress) {
      alert("Please enter your delivery address.");
      return;
    }

    const orderDetails = {
      cartItems,
      deliveryAddress,
      paymentMethod,
      total: calculateTotal(),
    };

    console.log("Order Placed:", orderDetails);

    alert("Order placed successfully!");
    // Reset form or redirect as needed
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Place Order</h2>

      <h3>Order Summary</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {cartItems.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
            }}
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>Php {item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <h4>Total: Php {calculateTotal().toFixed(2)}</h4>

      <h3>Delivery Address</h3>
      <textarea
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        rows="3"
        placeholder="Enter your delivery address..."
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
      ></textarea>

      <h3>Payment Method</h3>
      <select
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="cash_on_delivery">Cash on Delivery</option>
      </select>

      <button
        onClick={handlePlaceOrder}
        style={{
          backgroundColor: "#28a745",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrder;
