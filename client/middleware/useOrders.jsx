import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "./middleware";

const useOrders = () => {
  const queryClient = useQueryClient();

  // Delete order function
  const deleteOrder = async (orderId) => {
    try {
      await userRequest.delete(`/orders/${orderId}`);
      queryClient.invalidateQueries("orders");
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
      const response = await userRequest.post(`/orders/${orderId}/cancel`);
      console.log(response);
      queryClient.invalidateQueries("orders");
      return response.data;
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  };

  // Fetch orders query
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  return {
    orders,
    isLoading,
    isError,
    error,
    deleteOrder,
    cancelOrder,
  };
};

export default useOrders;
