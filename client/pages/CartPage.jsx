import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Typography } from "@material-tailwind/react";
import Pagination from "../src/components/Pagination";
import Button from "../src/components/Button";
import useCart from "../middleware/useCart";
import Loading from "../src/components/Loading";

const CartPage = () => {
  const [
    cart,
    refetch,
    handleClearCart,
    deleteCartItem,
    increaseCartItemQuantity,
    decreaseCartItemQuantity,
    isLoading,
    isFetching,
  ] = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const deliveryPrice = 20;
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateSubTotal = () => {
      const total = cart.products?.reduce(
        (acc, item) => acc + item.quantity * item.productId.price,
        0
      );
      setSubTotal(total || 0);
    };
    calculateSubTotal();
  }, [cart]);

  useEffect(() => {
    setTotalPrice(subTotal + (subTotal > 0 ? deliveryPrice : 0));
  }, [subTotal]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      await increaseCartItemQuantity(productId);
    } catch (error) {
      console.error("Error increasing item quantity in cart:", error);
      toast.error("An error occurred while increasing item quantity");
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      await decreaseCartItemQuantity(productId);
    } catch (error) {
      console.error("Error decreasing item quantity in cart:", error);
      toast.error("An error occurred while decreasing item quantity");
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="mt-2">
        <Loading />;
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer />
        <h1 className="py-1.5 font-medium text-center mb-8">YOUR CART</h1>
        <div className="p-5 sm:p-2">
          {cart.products?.length > 0 ? (
            <div>
              <div className="relative flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-lg shadow-md mb-8">
                <Link to={"/products"}>
                  <button className="px-4 py-1.5 font-medium border border-gray-300 rounded-lg bg-transparent hover:bg-gray-100 transition duration-300 mb-2 sm:mb-0">
                    CONTINUE SHOPPING
                  </button>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                  <div className="underline cursor-pointer mx-2 mb-2 sm:mb-0">
                    Shopping Bag({cart.products?.length || 0})
                  </div>
                </div>
                {cart.products?.length > 0 && (
                  <div className="absolute top-0 right-0 mt-2 mr-2">
                    <button
                      className="px-4 py-2 bg-red-500 font-semibold rounded-lg shadow-md transition duration-300 flex gap-2 items-center justify-center"
                      onClick={handleClearCart}
                    >
                      <span className="text-white"> Clear All</span>
                      <span>
                        {" "}
                        <FaTrashAlt className="text-white" />{" "}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <Card className="h-full w-full overflow-scroll mb-8">
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
                          Image
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          Product Name
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          Quantity
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          Price
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
                    {cart.products?.map((item, index) => (
                      <tr key={index}>
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
                          <div className="rounded-full w-12 h-12 overflow-hidden">
                            <img
                              src={item.productId.image}
                              alt={item.productId.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal capitalize"
                          >
                            {item.productId.title}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal capitalize"
                          >
                            <button
                              className="btn text-xl"
                              onClick={() =>
                                handleDecreaseQuantity(item.productId._id)
                              }
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              className="w-10 mx-2 text-center overflow-hidden appearance-none"
                              readOnly
                            />
                            <button
                              className="btn text-xl"
                              onClick={() =>
                                handleIncreaseQuantity(item.productId._id)
                              }
                            >
                              +
                            </button>
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            ${item.productId.price.toFixed(2)}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <button
                            className="btn hover:bg-red-600"
                            onClick={() => deleteCartItem(item.productId._id)}
                          >
                            <FaTrashAlt className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
                <div className="md:w-1/2 space-y-3">
                  <h3 className="py-1.5 font-medium">Shopping Details</h3>
                  <p>Total Items: {cart.products?.length || 0}</p>
                  <p>
                    Sub Total:{" "}
                    <span id="sub-total-price">$ {subTotal.toFixed(2)}</span>
                  </p>
                  <p>
                    Delivery Price:{" "}
                    <span id="delivery-price">
                      ${subTotal === 0 ? 0 : deliveryPrice}
                    </span>
                  </p>
                  <p>
                    Total Price:{" "}
                    <span id="total-price">${totalPrice.toFixed(2)}</span>
                  </p>
                  <Link to="/delivery-info">
                    <div className="mt-4">
                      <Button
                        variant="secondary"
                        text={"proceed to delivery info"}
                      />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Back to Menu Button */}
              <div className="flex items-center justify-center mt-4">
                <Link to="/products">
                  <Button variant="secondary" text={"back to products"} />
                </Link>
              </div>

              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-center py-1.5 font-medium">
                Your cart is empty please add products to cart
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
