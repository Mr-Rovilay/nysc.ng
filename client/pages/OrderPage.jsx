import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Typography } from "@material-tailwind/react";
import useOrders from "../middleware/useOrders";
import Loading from "../src/components/Loading";
import AnimationWrapper from "../src/common/AnimationWrapper";

const OrdersPage = () => {
  const { orders, isLoading, isError, error, deleteOrder, cancelOrder } =
    useOrders();
  const [cancelingOrderId, setCancelingOrderId] = useState(null); // Track the order being canceled

  useEffect(() => {
    if (isError) {
      console.error("Error fetching orders:", error);
    }
  }, [isError, error]);

  const handleCancelOrder = async (orderId) => {
    setCancelingOrderId(orderId); // Set the current order being canceled
    try {
      await cancelOrder(orderId);
      toast.success("Order canceled successfully");
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Error canceling order");
    } finally {
      setCancelingOrderId(null); // Reset the canceling order
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };

  if (isLoading) {
    return (
      <div className="mt-2">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container min-h-screen bg-gray-100">
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
              const { _id, address, status, products, amount } = order;
              const {
                firstName,
                lastName,
                street,
                city,
                state,
                postalCode,
                country,
              } = address;

              return (
                <Card
                  key={_id}
                  className="mb-8 p-4 bg-white rounded-lg shadow-md"
                >
                  <Typography variant="h6" className="font-bold mb-4">
                    Order ID: {_id}
                  </Typography>
                  <div className="mb-4">
                    <Typography variant="small" className="font-semibold">
                      Address:
                    </Typography>
                    <Typography variant="small">
                      {street}, {city}, {state}, {postalCode}, {country}
                    </Typography>
                  </div>
                  <div className="mb-4">
                    <Typography variant="small" className="font-semibold">
                      Fullname:
                    </Typography>
                    <Typography variant="small">
                      {firstName} {lastName}
                    </Typography>
                  </div>
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
                      Products:
                    </Typography>
                    {products.length === 0 ? (
                      <Typography variant="small">No products</Typography>
                    ) : (
                      products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex justify-between items-center mb-2"
                        >
                          <Typography variant="small" className="font-normal">
                            {product.title} (x{product.quantity})
                          </Typography>
                          <Typography variant="small" className="font-normal">
                            Price: ${product.price}
                          </Typography>
                        </div>
                      ))
                    )}
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
                      className="py-1.5 font-medium bg-green-500"
                      onClick={() => handleCancelOrder(_id)}
                      disabled={cancelingOrderId === _id}
                    >
                      {cancelingOrderId === _id ? (
                        <div className="flex items-center gap-2">
                          <Loading small /> Canceling...
                        </div>
                      ) : status == "Cancelled" ? (
                        "Cancelled"
                      ) : (
                        "Cancel Order"
                      )}
                    </Button>
                    <Button
                      color="red"
                      className=""
                      onClick={() => handleDeleteOrder(_id)}
                    >
                      Delete Order
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
