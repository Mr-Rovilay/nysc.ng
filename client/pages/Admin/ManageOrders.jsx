import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../middleware/AuthContext";
import { userRequest } from "../../middleware/middleware";
import {
  Card,
  Typography,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import Pagination from "../../src/components/Pagination";
import { FaCheck, FaTrashAlt } from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  const fetchOrders = async (page) => {
    try {
      const response = await userRequest.get(`/orders?page=${page}`);
      if (response.data.orders) {
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("No orders found in response.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setLoadingOrder(orderId);
    try {
      await userRequest.patch(`/orders/${orderId}`, { status });
      toast.success("Order status updated successfully");
      fetchOrders(currentPage);
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setLoadingOrder(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="flex items-center justify-between m-4">
        <h5>All Orders</h5>
        <h5>Total Orders: {orders.length}</h5>
      </div>

      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  #
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Customer
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Address
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Products
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Total Price
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Status
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Date
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Action
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => {
                const formattedDate = new Date(
                  order.createdAt
                ).toLocaleDateString();
                const formattedTime = new Date(
                  order.createdAt
                ).toLocaleTimeString();

                return (
                  <tr
                    key={order._id}
                    className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}
                  >
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal capitalize"
                      >
                        {order.address.firstName} {order.address.lastName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {order.address.street}, {order.address.city},{" "}
                        {order.address.state}, {order.address.country},{""}
                        <p>
                          PhoneNumber:{" "}
                          <span className="font-bold">
                            {order.address.phone}
                          </span>
                        </p>
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {order.products.map((product, i) => (
                          <div key={i}>
                            {product.quantity} x {product.productId} (₦
                            {product.price})
                          </div>
                        ))}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        ₦ <span className="font-bold">{order.amount}</span>
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Select
                        label="Status"
                        value={order.status}
                        onChange={(value) =>
                          handleStatusChange(order._id, value)
                        }
                        disabled={loadingOrder === order._id}
                        className="w-full"
                      >
                        <Option value="Pending">Pending</Option>
                        <Option value="Processing">Processing</Option>
                        <Option value="Shipped">Shipped</Option>
                        <Option value="Delivered">Delivered</Option>
                        <Option value="Cancelled">Cancelled</Option>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formattedDate} at {formattedTime}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Button
                        className="bg-green hover:bg-dark-green"
                        onClick={() =>
                          handleStatusChange(order._id, "Delivered")
                        }
                        disabled={loadingOrder === order._id}
                      >
                        <FaCheck className="text-green-500" />
                      </Button>
                      <Button
                        className="bg-red hover:bg-dark-red ml-2"
                        onClick={() =>
                          handleStatusChange(order._id, "Cancelled")
                        }
                        disabled={loadingOrder === order._id}
                      >
                        <FaTrashAlt className="text-red-500" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    No orders found.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ManageOrders;
