import { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const KEY =
  "pk_test_51PIrjVDEuICN2tR6mu3FDOrariHkSp4gKzFwpvOyDz2Mab0G8AtCdBjvFzhLXJQ3hQyIARThN49vd6yTOlbCYK2J00P8L5Pgb1";

const Pay = () => {
  const [stripe, setStripe] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/product"); // Update the endpoint as necessary
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Initialize Stripe
  const initializeStripe = async () => {
    if (!stripe) {
      const stripeInstance = await loadStripe(KEY);
      setStripe(stripeInstance);
    }
  };

  // Make payment
  const makePayment = async () => {
    await initializeStripe();

    try {
      const response = await axios.post(
        "http://localhost:4000/payment/checkout",
        { products }, // Send products to the backend
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={makePayment}
        style={{
          border: "none",
          width: 120,
          borderRadius: 5,
          padding: "20px",
          backgroundColor: "black",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Pay;
