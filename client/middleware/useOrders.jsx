import { useQuery, useMutation } from "@tanstack/react-query";
import { userRequest } from "./middleware";

const useOrders = () => {
  // Delete order function
  const deleteOrder = async (orderId) => {
    try {
      await userRequest.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      const response = await userRequest.get("/orders/myorders");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };
  // Cancel order function
  const cancelOrder = async (orderId) => {
    try {
      const response = await userRequest.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  };

  // Fetch orders query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"], // Change the queryKey to an array
    queryFn: fetchOrders,
  });

  // Mutation for deleting an order
  const deleteOrderMutation = useMutation(deleteOrder);

  // Mutation for canceling an order
  const cancelOrderMutation = useMutation(cancelOrder);

  return {
    orders: data,
    isLoading,
    isError,
    error,
    deleteOrder: deleteOrderMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
  };
};

export default useOrders;
