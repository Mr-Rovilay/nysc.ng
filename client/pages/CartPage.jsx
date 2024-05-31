import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import AnimationWrapper from "../src/common/AnimationWrapper";
import { toast } from "react-toastify";
import { userRequest } from "../middleware/middleware";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [productItems, setProductItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await userRequest.get("/carts");
        setCart(response.data.products);
      } catch (error) {
        toast.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      setCartVisible(true);
    } else {
      setCartVisible(false);
    }
  }, [cart]);

  const handleIncrease = async (item) => {
    try {
      const response = await userRequest.post(`/carts`, {
        productId: item.productId,
        quantity: 1,
      });

      if (response.status === 201) {
        const updatedCart = cart.map((cartItem) => {
          if (cartItem.productId === item.productId) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          }
          return cartItem;
        });
        setCart(updatedCart);
        toast.success("Quantity updated successfully");
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      toast.error("Error updating quantity:", error);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        const response = await userRequest.post(`/carts`, {
          productId: item.productId,
          quantity: 1,
        });

        if (response.status === 201) {
          const updatedCart = cart.map((cartItem) => {
            if (cartItem.productId === item.productId) {
              return {
                ...cartItem,
                quantity: cartItem.quantity - 1,
              };
            }
            return cartItem;
          });
          setCart(updatedCart);
          toast.success("Quantity reduced successfully");
        } else {
          toast.error("Failed to reduce quantity");
        }
      } catch (error) {
        toast.error("Error reducing quantity:", error);
      }
    } else {
      toast.error("Item quantity can't be zero");
    }
  };

  const handleDelete = async (item) => {
    try {
      const response = await userRequest.delete(`/carts/${item.productId}`);
      if (response.status === 204) {
        setCart((prevCart) =>
          prevCart.filter((cartItem) => cartItem.productId !== item.productId)
        );
        toast.success("Item deleted successfully");
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item:", error);
    }
  };

  const calculateTotalPrice = (item) => item.price * item.quantity;

  const totalItems = cart.reduce(
    (total, item) => total + calculateTotalPrice(item),
    0
  );

  return (
    <AnimationWrapper>
      <div className="min-h-screen bg-gray-100">
        <div className="p-5 sm:p-2">
          <h1 className="text-3xl font-light text-center mb-8">YOUR CART</h1>
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-lg shadow-md mb-8">
            <Link to={"/products"}>
              <button className="px-4 py-2 font-semibold border border-gray-300 rounded-lg bg-transparent hover:bg-gray-100 transition duration-300 mb-2 sm:mb-0">
                CONTINUE SHOPPING
              </button>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
              <div className="underline cursor-pointer mx-2 mb-2 sm:mb-0">
                Shopping Bag({cart.length})
              </div>
            </div>
            <button className="px-4 py-2 font-semibold text-white bg-black rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
              CHECKOUT NOW
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-5">
            <div className="flex-3 bg-white rounded-lg shadow-md p-5">
              {cart.map((item) => (
                <div
                  className="flex flex-col md:flex-row justify-between mb-5"
                  key={item.productId}
                >
                  <div className="flex-1 space-y-8 border border-gray-300 rounded-lg p-5 bg-white shadow-md">
                    <img
                      className="w-52 rounded-lg"
                      src={item.Image}
                      alt="Product"
                    />
                    <div className="p-5 flex flex-col justify-around">
                      <span className="font-semibold">
                        Product: {item.title}
                      </span>
                      <span className="text-gray-600">
                        ID: {item.productId}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-black"></div>
                      <span className="text-gray-600">
                        Price: ${item.price}
                      </span>
                      <span className="text-gray-600">
                        Total: {calculateTotalPrice(item).toFixed(2)}
                      </span>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="flex items-center mb-5">
                          <div className="text-2xl cursor-pointer">
                            <IoIosRemoveCircleOutline
                              onClick={() => handleDecrease(item)}
                            />
                          </div>
                          <div className="text-2xl mx-2">{item.quantity}</div>
                          <div className="text-2xl cursor-pointer">
                            <IoMdAdd onClick={() => handleIncrease(item)} />
                          </div>
                        </div>
                        <div className="text-3xl font-light">${item.price}</div>
                        <div
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-8 border border-gray-300 rounded-lg p-5 bg-white shadow-md">
              <h1 className="text-2xl font-light mb-5">ORDER SUMMARY</h1>
              <div className="flex justify-between my-5 text-base">
                <span>Subtotal</span>
                <span>${totalItems.toFixed(2)}</span>
              </div>
              <div className="flex justify-between my-5 text-base">
                <span>Estimated Shipping</span>
                <span>$ 10.00</span>
              </div>
              <div className="flex justify-between my-5 text-base">
                <span>Shipping Discount</span>
                <span>$ -10.00</span>
              </div>
              <div className="flex justify-between my-5 text-xl font-medium">
                <span>Total</span>
                <span>${totalItems.toFixed(2)}</span>
              </div>
              <button className="w-full px-4 py-2 text-white bg-black rounded-lg shadow-md font-semibold hover:bg-gray-800 transition duration-300">
                CHECKOUT NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default CartPage;
