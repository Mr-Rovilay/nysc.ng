import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { userRequest } from "./middleware";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useCart = () => {
  const { token } = useContext(AuthContext);

  const {
    refetch,
    data: cart = {},
    error,
    isError,
  } = useQuery({
    queryKey: ["carts", token],
    queryFn: async () => {
      try {
        const response = await userRequest.get("/carts");
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
      }
    },
    enabled: !!token,
  });

  const handleClearCart = async () => {
    try {
      const response = await userRequest.delete("/carts");
      if (response.status === 204) {
        refetch(cart);
        toast.success("Cart cleared successfully");
      } else {
        toast.error("Failed to clear cart");
      }
    } catch (error) {
      toast.error("An error occurred while clearing cart");
      console.error("Error clearing cart:", error);
    }
  };

  const deleteCartItem = async (productId) => {
    try {
      const response = await userRequest.delete(`/carts/${productId}`);
      if (response.status === 204) {
        refetch(cart);
        toast.success("Item removed from cart successfully");
      } else {
        toast.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("An error occurred while removing item from cart");
    }
  };

  const increaseCartItemQuantity = async (productId) => {
    try {
      const response = await userRequest.post(`/carts/increase/${productId}`);
      if (response.status === 200) {
        refetch(cart);
        toast.success("Item quantity increased successfully");
      } else {
        toast.error("Failed to increase item quantity");
      }
    } catch (error) {
      console.error("Error increasing item quantity in cart:", error);
      toast.error("An error occurred while increasing item quantity");
    }
  };

  const decreaseCartItemQuantity = async (productId) => {
    try {
      const response = await userRequest.post(`/carts/decrease/${productId}`);
      if (response.status === 200) {
        refetch(cart);
        toast.success("Item quantity decreased successfully");
      } else {
        toast.error("Failed to decrease item quantity");
      }
    } catch (error) {
      console.error("Error decreasing item quantity in cart:", error);
      toast.error("An error occurred while decreasing item quantity");
    }
  };

  useEffect(() => {
    if (isError) {
      console.error("Error fetching cart:", error);
    }
  }, [isError, error]);

  return [
    cart,
    refetch,
    handleClearCart,
    deleteCartItem,
    increaseCartItemQuantity,
    decreaseCartItemQuantity,
  ];
};

export default useCart;
