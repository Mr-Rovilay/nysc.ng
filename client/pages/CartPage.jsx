import React, { useEffect, useState, useCallback } from "react";
import { FaTrashAlt, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Button as MaterialButton } from "@material-tailwind/react";
import Button from "../src/components/Button";
import useCart from "../middleware/useCart";
import Loading from "../src/components/Loading";
import debounce from "../middleware/debounce";

const CartItem = ({ item, index }) => {
  const { deleteCartItem, increaseCartItemQuantity, decreaseCartItemQuantity } =
    useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityIncrease = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= item.productId.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityDecrease = () => {
    const newQuantity = quantity - 1;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityUpdate = useCallback(
    debounce(async (newQuantity) => {
      try {
        if (newQuantity > item.quantity) {
          await increaseCartItemQuantity(
            item.productId._id,
            newQuantity - item.quantity
          );
        } else if (newQuantity < item.quantity) {
          await decreaseCartItemQuantity(
            item.productId._id,
            item.quantity - newQuantity
          );
        }
        setQuantity(newQuantity);
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }, 500),
    [item.quantity, increaseCartItemQuantity, decreaseCartItemQuantity]
  );

  useEffect(() => {
    if (quantity !== item.quantity) {
      handleQuantityUpdate(quantity);
    }
  }, [quantity, item.quantity, handleQuantityUpdate]);

  return (
    <tr key={item._id}>
      <td className="p-4">{index + 1}</td>
      <td className="p-4">
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <img
            src={item.productId.image}
            alt={item.productId.title}
            className="w-full h-full object-cover"
          />
        </div>
      </td>
      <td className="p-4 capitalize">{item.productId.title}</td>
      <td className="p-4">
        <div className="flex items-center">
          <button
            className={`text-xl px-2 ${
              quantity <= 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={handleQuantityDecrease}
            disabled={quantity <= 1}
          >
            <FaMinusCircle />
          </button>

          <input
            type="number"
            value={quantity}
            className="w-10 mx-2 text-center"
            readOnly
          />
          <button
            className={`text-xl px-2 ${
              quantity <= 1
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={handleQuantityIncrease}
            disabled={quantity >= item.productId.stock}
          >
            <FaPlusCircle />
          </button>
        </div>
      </td>
      <td className="p-4">₦{(item.productId.price * quantity).toFixed(2)}</td>
      <td className="p-4">
        <button
          className="text-red-500 hover:text-red-600"
          onClick={() => deleteCartItem(item.productId._id)}
        >
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
};

const CartPage = () => {
  const { cart, isLoading } = useCart();
  const [subTotal, setSubTotal] = React.useState(0);
  const deliveryPrice = 20;
  const [totalPrice, setTotalPrice] = React.useState(0);

  React.useEffect(() => {
    const calculateSubTotal = () => {
      const total = cart.products?.reduce(
        (acc, item) => acc + item.quantity * item.productId.price,
        0
      );
      setSubTotal(total || 0);
    };
    calculateSubTotal();
  }, [cart]);

  React.useEffect(() => {
    setTotalPrice(subTotal + (subTotal > 0 ? deliveryPrice : 0));
  }, [subTotal]);

  if (isLoading) {
    return (
      <div className="container mt-2">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container min-h-screen bg-gray-100">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-center mt-8 mb-6">
        YOUR CART
      </h1>
      <div className="mx-auto p-4">
        {cart.products?.length > 0 ? (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-6">
              <Link to="/products">
                <MaterialButton className="mb-2 sm:mb-0 bg-green-500">
                  CONTINUE SHOPPING
                </MaterialButton>
              </Link>
              <div className="flex flex-col sm:flex-row items-center">
                <span className="underline cursor-pointer mx-2 mb-2 sm:mb-0">
                  Shopping Bag ({cart.products.length})
                </span>
              </div>
            </div>

            <Card className="overflow-scroll mb-6">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.products?.map((item, i) => (
                    <CartItem item={item} index={i} key={item._id} />
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="flex flex-col md:flex-row justify-between items-start my-8 gap-8 bg-white p-4 rounded-lg shadow-md">
              <div className="md:w-1/2">
                <h3 className="text-lg font-medium mb-2">Shopping Details</h3>
                <p>Total Items: {cart.products?.length || 0}</p>
                <p>Sub Total: ₦{subTotal.toFixed(2)}</p>
                <p>Delivery Price: ₦{subTotal === 0 ? 0 : deliveryPrice}</p>
                <p>Total Price: ₦{totalPrice.toFixed(2)}</p>
                <Link to="/delivery-info">
                  <MaterialButton className="mt-4 bg-green-500">
                    Proceed to Delivery Info
                  </MaterialButton>
                </Link>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link to="/products">
                <Button variant="secondary" text="Back to Products" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full mt-10">
            <p className="text-center text-lg">
              Your cart is empty, please add products to the cart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
