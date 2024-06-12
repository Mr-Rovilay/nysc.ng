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
    data: cart = [],
    error,
    isError,
    isLoading,
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

  // Handle clearing the cart
  const handleClearCart = async () => {
    try {
      const response = await userRequest.delete("/carts");
      if (response.status === 204) {
        toast.success("Cart cleared successfully");
        await refetch();
      } else {
        toast.error("Failed to clear cart");
      }
    } catch (error) {
      toast.error("An error occurred while clearing cart");
      console.error("Error clearing cart:", error);
    }
  };

  // Handle deleting a cart item
  const deleteCartItem = async (productId) => {
    try {
      const response = await userRequest.delete(`/carts/${productId}`);
      if (response.status === 204) {
        await refetch();
      } else {
        toast.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("An error occurred while removing item from cart");
    }
  };

  const increaseCartItemQuantity = async (productId, quantity) => {
    try {
      const response = await userRequest.patch(`/carts/increase/${productId}`, {
        quantity,
      });

      if (response.status === 200) {
        await refetch();
      } else {
        toast.error("Failed to increase item quantity in cart");
      }
    } catch (error) {
      console.error("Error increasing item quantity in cart:", error);
      toast.error("An error occurred while increasing item quantity in cart");
    }
  };

  const decreaseCartItemQuantity = async (productId, quantity) => {
    try {
      const response = await userRequest.post(`/carts/decrease/${productId}`, {
        quantity,
      });

      if (response.status === 200) {
        await refetch();
      } else {
        toast.error("Failed to decrease item quantity in cart");
      }
    } catch (error) {
      console.error("Error decreasing item quantity in cart:", error);
      toast.error("An error occurred while decreasing item quantity in cart");
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
    isLoading,
  ];
};

export default useCart;
