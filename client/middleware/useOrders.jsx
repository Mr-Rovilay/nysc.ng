import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { userRequest } from "./middleware";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useOrders = () => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [cancelError, setCancelError] = useState(null);

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

  // Delete order function
  const deleteOrder = async (orderId) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await userRequest.delete(`/orders/${orderId}`);
      queryClient.invalidateQueries("orders");
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel order function
  const cancelOrder = async (orderId) => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      const response = await userRequest.post(`/orders/${orderId}/cancel`);
      queryClient.invalidateQueries("orders");
      toast.success("Order canceled successfully");
      return response.data;
    } catch (error) {
      setCancelError("Error canceling order");
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    orders,
    isLoading,
    isError,
    error,
    isDeleting,
    deleteError,
    deleteOrder,
    isCancelling,
    cancelError,
    cancelOrder,
  };
};

export default useOrders;
