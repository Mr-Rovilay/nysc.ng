import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "./middleware";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useOrders = () => {
  const queryClient = useQueryClient();

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

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      await userRequest.delete(`/orders/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
      toast.success("Order deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await userRequest.post(`/orders/${orderId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
      toast.success("Order canceled successfully");
    },
    onError: (error) => {
      console.error("Error canceling order:", error);
      toast.error("Error canceling order");
    },
  });

  return {
    orders,
    isLoading,
    isError,
    error,
    deleteOrder: deleteOrderMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate,
  };
};

export default useOrders;
