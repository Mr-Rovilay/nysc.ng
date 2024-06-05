import { useQuery } from "@tanstack/react-query";
import { userRequest } from "./middleware";

const useOrders = () => {
  const { data, isLoading, isError, error } = useQuery("orders", {
    queryFn: fetchOrders, // assuming fetchOrders is defined somewhere
  });
  const fetchOrders = async () => {
    try {
      const response = await userRequest.get("/orders/myorders");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  const createOrder = async (products, address) => {
    try {
      const response = await userRequest.post("/orders", { products, address });
      const newOrder = response.data;
      return [...data, newOrder];
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await userRequest.delete(`/orders/${orderId}`);
      return data.filter((order) => order.id !== orderId);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await userRequest.put(`/orders/${orderId}/cancel`);
      const updatedOrder = response.data;
      return data.map((order) => (order.id === orderId ? updatedOrder : order));
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  };

  return {
    data,
    isLoading,
    isError,
    error,
    createOrder,
    deleteOrder,
    cancelOrder,
  };
};

export default useOrders;
