// @refresh false
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import { publicRequest, userRequest } from "./middleware";
import { toast } from "react-toastify";

export const CartContext = createContext(); // Exporting the context

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [state, action.payload];
    case "SET_CART":
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (item) => {
    try {
      console.log("Adding item to cart:", item);
      const res = await userRequest.post("/carts", { productId: item._id });
      console.log("Add to cart response:", res);
      if (res.status === 201) {
        dispatch({ type: "ADD_TO_CART", payload: item });
        setCartCount((prevCount) => prevCount + 1);
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await userRequest.get("/carts");
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: "SET_CART", payload: res.data.cartItems });
        setCartCount(res.data.cartItems.length); // Update cart count
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate cart count based on current cart items
  useEffect(() => {
    if (cart) {
      setCartCount(cart.length);
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); // Exporting the hook
