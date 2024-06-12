import { useContext, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { userRequest } from "./middleware";
import { toast } from "react-toastify";
import debounce from "./debounce";
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
      const response = await userRequest.get("/carts");
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data;
    },
    enabled: !!token,
  });

  /**
   * Displays a toast message based on the success of the operation.
   * @param {boolean} success - Whether the operation was successful.
   * @param {string} successMessage - The message to display on success.
   * @param {string} errorMessage - The message to display on error.
   */
  const handleToast = (success, successMessage, errorMessage) => {
    if (success) {
      toast.success(successMessage);
    } else {
      toast.error(errorMessage);
    }
  };

  /**
   * Clears the cart.
   */
  const handleClearCart = useCallback(async () => {
    try {
      const response = await userRequest.delete("/carts");
      const success = response.status === 204;
      handleToast(success, "Cart cleared successfully", "Failed to clear cart");
      if (success) await refetch();
    } catch (error) {
      toast.error("An error occurred while clearing cart");
      console.error("Error clearing cart:", error);
    }
  }, [refetch]);

  /**
   * Deletes a cart item.
   * @param {string} productId - The ID of the product to delete.
   */
  const deleteCartItem = useCallback(
    async (productId) => {
      try {
        const response = await userRequest.delete(`/carts/${productId}`);
        const success = response.status === 204;
        handleToast(
          success,
          "Item removed from cart",
          "Failed to remove item from cart"
        );
        if (success) await refetch();
      } catch (error) {
        toast.error("An error occurred while removing item from cart");
        console.error("Error removing item from cart:", error);
      }
    },
    [refetch]
  );

  /**
   * Increases the quantity of a cart item.
   * @param {string} productId - The ID of the product.
   * @param {number} quantity - The quantity to increase.
   */
  const increaseCartItemQuantity = useCallback(
    async (productId, quantity) => {
      try {
        const response = await userRequest.patch(
          `/carts/increase/${productId}`,
          { quantity }
        );
        const success = response.status === 200;
        handleToast(
          success,
          "Item quantity increased",
          "Failed to increase item quantity in cart"
        );
        if (success) await refetch();
      } catch (error) {
        toast.error("An error occurred while increasing item quantity in cart");
        console.error("Error increasing item quantity in cart:", error);
      }
    },
    [refetch]
  );

  /**
   * Decreases the quantity of a cart item.
   * @param {string} productId - The ID of the product.
   * @param {number} quantity - The quantity to decrease.
   */
  const decreaseCartItemQuantity = useCallback(
    async (productId, quantity) => {
      try {
        const response = await userRequest.patch(
          `/carts/decrease/${productId}`,
          { quantity }
        );
        const success = response.status === 200;
        handleToast(
          success,
          "Item quantity decreased",
          "Failed to decrease item quantity in cart"
        );
        if (success) await refetch();
      } catch (error) {
        toast.error("An error occurred while decreasing item quantity in cart");
        console.error("Error decreasing item quantity in cart:", error);
      }
    },
    [refetch]
  );

  useEffect(() => {
    if (isError) {
      console.error("Error fetching cart:", error);
    }
  }, [isError, error]);

  // Debounce the increaseCartItemQuantity and decreaseCartItemQuantity functions
  const debouncedIncreaseCartItemQuantity = useCallback(
    debounce(increaseCartItemQuantity, 500),
    [increaseCartItemQuantity]
  );
  const debouncedDecreaseCartItemQuantity = useCallback(
    debounce(decreaseCartItemQuantity, 500),
    [decreaseCartItemQuantity]
  );

  return [
    cart,
    refetch,
    handleClearCart,
    deleteCartItem,
    debouncedIncreaseCartItemQuantity,
    debouncedDecreaseCartItemQuantity,
    isLoading,
  ];
};

export default useCart;
