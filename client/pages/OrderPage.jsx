import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Typography } from "@material-tailwind/react";
import useOrders from "../middleware/useOrders";
import Loading from "../src/components/Loading";
import AnimationWrapper from "../src/common/AnimationWrapper";

const OrdersPage = () => {
  const { orders, isLoading, isError, error, deleteOrder, cancelOrder } =
    useOrders();
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  }, [isError, error]);

  const handleCancelOrder = async (orderId, status) => {
    if (
      status === "Processing" ||
      status === "Shipped" ||
      status === "Delivered"
    ) {
      toast.error(`Cannot cancel order with status: ${status}`);
      return;
    }

    setCancelingOrderId(orderId);
    try {
      await cancelOrder(orderId);
      toast.success("Order canceled successfully");
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Error canceling order");
    } finally {
      setCancelingOrderId(null);
    }
  };

  const handleDeleteOrder = (orderId) => {
    deleteOrder(orderId);
  };

  const openDialog = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="container mt-2">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen container bg-gray-100">
      <AnimationWrapper />
      <ToastContainer />
      <div className="p-5 sm:p-2">
        <h1 className="py-1.5 font-medium text-center mb-8">Your Orders</h1>
        <div className="flex flex-col">
          {!orders || orders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center">You have no orders</p>
            </div>
          ) : (
            orders.map((order) => {
              const { _id, address, status, products, amount, createdAt } =
                order;
              const {
                firstName,
                lastName,
                street,
                city,
                state,
                postalCode,
                country,
              } = address;

              const formattedDate = new Date(createdAt).toLocaleDateString();
              const formattedTime = new Date(createdAt).toLocaleTimeString();

              return (
                <Card
                  key={_id}
                  className="mb-8 p-4 bg-white rounded-lg shadow-md relative"
                >
                  <Typography variant="h6" className="font-bold mb-4">
                    {/* Button specifically for order ID */}
                    <button
                      onClick={() => openDialog(order)}
                      className="font-bold text-blue-500 hover:underline focus:outline-none"
                    >
                      Order ID: {_id}
                    </button>
                  </Typography>
                  {/* Conditional rendering for order details dialog */}
                  {dialogOpen && selectedOrder && selectedOrder._id === _id && (
                    <div className="fixed inset-0 z-50 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
                      <div className="max-w-[80%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl">
                        <div className="flex items-center p-4 text-2xl font-semibold leading-snug text-blue-gray-900">
                          <h1 className="capitalize">Order Details</h1>
                          <Button
                            onClick={closeDialog}
                            color="red"
                            size="sm"
                            className="ml-auto"
                          >
                            Close
                          </Button>
                        </div>
                        <div className="relative p-4 text-base font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500 break-all">
                          <div className="mb-4">
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              Date:
                            </Typography>
                            <Typography variant="small">
                              {formattedDate} at {formattedTime}
                            </Typography>
                          </div>
                          <div className="mb-4">
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              Address:
                            </Typography>
                            <Typography variant="small">
                              {street}, {city}, {state}, {postalCode}, {country}
                            </Typography>
                          </div>
                          <div className="mb-4">
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              Fullname:
                            </Typography>
                            <Typography variant="small">
                              {firstName} {lastName}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              Products:
                            </Typography>
                            {/* Map through products in the order */}
                            {products.length === 0 ? (
                              <Typography variant="small">
                                No products
                              </Typography>
                            ) : (
                              products.map((product) => (
                                <div
                                  key={product.productId._id}
                                  className="flex justify-between items-center mb-2"
                                >
                                  <Typography
                                    variant="small"
                                    className="font-normal"
                                  >
                                    {product.productId.title} (x
                                    {product.quantity})
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    className="font-normal"
                                  >
                                    Price: ${product.price}
                                  </Typography>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mb-4">
                    <Typography variant="small" className="font-semibold">
                      Status:
                    </Typography>
                    <Typography variant="small" className="font-bold">
                      {status === "Delivered" ? (
                        <span className="text-green-500">&#x2714; </span>
                      ) : status === "Processing" ? (
                        <span className="text-yellow-500">&#x25cf; </span>
                      ) : status === "Shipped" ? (
                        <span className="text-blue-500">&#x25cf; </span>
                      ) : (
                        <span className="text-red-500">&#x25cf; </span>
                      )}
                      {status}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="font-semibold">
                      Total Amount:
                    </Typography>
                    <Typography variant="small">
                      ${amount.toFixed(2)}
                    </Typography>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      className={`py-1.5 font-medium ${
                        cancelingOrderId === _id ||
                        status === "Cancelled" ||
                        status === "Delivered"
                          ? "cursor-not-allowed"
                          : "bg-green-500"
                      }`}
                      onClick={() => handleCancelOrder(_id, status)}
                      disabled={
                        cancelingOrderId === _id ||
                        status === "Cancelled" ||
                        status === "Delivered"
                      }
                    >
                      {cancelingOrderId === _id ? (
                        <div className="flex items-center gap-2">
                          <Loading small /> Canceling...
                        </div>
                      ) : status === "Cancelled" ? (
                        "Cancelled"
                      ) : (
                        "Cancel Order"
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
