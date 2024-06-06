import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Typography } from "@material-tailwind/react";
import useOrders from "../middleware/useOrders";

const OrdersPage = () => {
  const { orders, isLoading, isError, error, deleteOrder, cancelOrder } =
    useOrders();

  useEffect(() => {
    if (isError) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    }
  }, [isError, error]);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Error canceling order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="p-5 sm:p-2">
        <h1 className="text-3xl font-light text-center mb-8">Your Orders</h1>
        <div className="flex flex-col">
          {orders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center">You have no orders</p>
            </div>
          ) : (
            orders.map((order) => (
              <Card
                key={order._id}
                className="mb-8 p-4 bg-white rounded-lg shadow-md"
              >
                <Typography variant="h6" className="font-bold mb-4">
                  Order ID: {order._id}
                </Typography>
                <div className="mb-4">
                  <Typography variant="small" className="font-semibold">
                    Address:
                  </Typography>
                  <Typography variant="small">
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state}, {order.address.postalCode},{" "}
                    {order.address.country}
                  </Typography>
                </div>
                <div className="mb-4">
                  <Typography variant="small" className="font-semibold">
                    Status:
                  </Typography>
                  <Typography variant="small" className="font-bold">
                    {" "}
                    <span className="text-red-500">&#x25cf; </span>
                    {order.status}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="font-semibold">
                    Products:
                  </Typography>
                  {order.products.map((product) => (
                    <div
                      key={product.productId}
                      className="flex justify-between items-center mb-2"
                    >
                      <Typography variant="small" className="font-normal">
                        {product.productId.title} (x{product.quantity})
                      </Typography>
                      <Typography variant="small" className="font-normal">
                        ${product.price}
                      </Typography>
                    </div>
                  ))}
                </div>
                <div>
                  <Typography variant="small" className="font-semibold">
                    Total Amount:
                  </Typography>
                  <Typography variant="small">
                    ${order.amount.toFixed(2)}
                  </Typography>
                </div>

                <div>
                  <button onClick={() => handleCancelOrder(order._id)}>
                    Cancel Order
                  </button>
                </div>
                <div>
                  <button onClick={() => handleDeleteOrder(order._id)}>
                    Delete Order
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
