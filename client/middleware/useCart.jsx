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

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const response = await userRequest.put(`/carts`, {
        products: [{ productId, quantity: newQuantity }],
      });
      if (response.status === 200) {
        refetch();
        toast.success("Item quantity updated successfully");
      } else {
        toast.error("Failed to update item quantity");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("An error occurred while updating item quantity");
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
    updateCartItemQuantity,
  ];
};

export default useCart;
