// OrdersPage.js
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Typography } from "@material-tailwind/react";
import useOrders from "../middleware/useOrders";

const OrdersPage = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    createOrder,
    deleteOrder,
    cancelOrder,
  } = useOrders();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    }
  }, [isError, error]);

  const handleCancelOrder = async (orderId) => {
    setIsCanceling(true);
    try {
      await cancelOrder(orderId);
      toast.success("Order canceled successfully");
    } catch (error) {
      setCancelError(error.message);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setIsDeleting(true);
    try {
      await deleteOrder(orderId);
      toast.success("Order deleted successfully");
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateOrder = async () => {
    setIsCreating(true);
    try {
      const products = [];
      const address = {};
      await createOrder(products, address);
      toast.success("Order created successfully");
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100">
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
                    <Typography variant="small">{order.status}</Typography>
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
                  <div className="mt-4">
                    <Typography variant="small" className="font-semibold">
                      Total Amount:
                    </Typography>
                    <Typography variant="small">
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                  </div>
                  <div>
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCanceling}
                    >
                      {isCanceling ? "Canceling..." : "Cancel Order"}
                    </button>
                    {cancelError && (
                      <div>Error canceling order: {cancelError}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Order"}
                  </button>
                  {deleteError && (
                    <div>Error deleting order: {deleteError}</div>
                  )}
                </Card>
              ))
            )}
          </div>
          <div>
            <button onClick={handleCreateOrder} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Order"}
            </button>
            {createError && <div>Error creating order: {createError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
