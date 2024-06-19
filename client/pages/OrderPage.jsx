import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Typography } from "@material-tailwind/react";
import useOrders from "../middleware/useOrders";
import Loading from "../src/components/Loading";
import AnimationWrapper from "../src/common/AnimationWrapper";
import { Link, useLocation } from "react-router-dom";
import { publicRequest } from "../middleware/middleware";

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

const OrdersPage = () => {
  const { orders, isLoading, isError, error, deleteOrder, cancelOrder } =
    useOrders();
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await publicRequest.get(`/products/${id}`);
        setResults(response.data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    getProduct();
  }, [id]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  }, [isError, error]);

  const handleCancelOrder = async (orderId, status) => {
    if (["Shipped", "Delivered"].includes(status)) {
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
    <div className="min-h-screen container ">
      <AnimationWrapper />
      <ToastContainer />
      <div className="p-5 sm:p-2">
        <h1 className="py-1.5 font-medium text-center mb-8">Orders</h1>
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
                    <button
                      onClick={() => openDialog(order)}
                      className="font-bold text-blue-500 hover:underline focus:outline-none"
                    >
                      Order ID: {_id}
                    </button>
                  </Typography>
                  {dialogOpen && selectedOrder && selectedOrder._id === _id && (
                    <div className="fixed inset-0 z-50 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
                      <div className="max-w-[80%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl">
                        <div className="flex justify-between p-4 text-xl leading-snug text-blue-gray-900">
                          <h1 className="capitalize font-semibold ">
                            Order Details
                          </h1>
                          <p
                            onClick={closeDialog}
                            size="sm"
                            className="cursor-pointer"
                          >
                            x
                          </p>
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
                                    <li key={product._id}>
                                      <Link
                                        to={`/product/${product.productId._id}`}
                                      >
                                        {product.productId.title}
                                      </Link>
                                      {""} - (x{product.quantity})
                                    </li>
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    className="font-normal"
                                  >
                                    Price: {formatPrice(product.price)}
                                  </Typography>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              Total Amount:
                            </Typography>
                            <Typography variant="small">
                              {formatPrice(amount)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mb-4 flex gap-2">
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
                  <div className="flex gap-2">
                    <Typography variant="small" className="font-semibold">
                      Total Amount:
                    </Typography>
                    <Typography variant="small">
                      {formatPrice(amount)}
                    </Typography>
                  </div>
                  <div className="flex gap-3 mt-4">
                    {status !== "Delivered" && status !== "Cancelled" && (
                      <Button
                        className={`py-1.5 font-medium ${
                          cancelingOrderId === _id || status === "Cancelled"
                            ? "cursor-not-allowed"
                            : "bg-green-500"
                        }`}
                        onClick={() => handleCancelOrder(_id, status)}
                        disabled={
                          cancelingOrderId === _id || status === "Cancelled"
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
                    )}
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
