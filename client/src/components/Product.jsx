import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "../../middleware/middleware";
import { AuthContext } from "../../middleware/AuthContext";
import { useNavigate } from "react-router-dom";

import Loading from "./Loading";
import { Button } from "@material-tailwind/react";

const Product = ({ item }) => {
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const checkCart = async () => {
      try {
        const response = await userRequest.get("/carts");
        if (response.status === 200) {
          const cart = response.data;
          const productInCart = cart.products.find(
            (product) => product.productId._id === item._id
          );
          if (productInCart) {
            setInCart(true);
          }
        }
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };

    checkCart();
  }, [item._id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    setLoading(true); // Set loading to true when adding to cart

    try {
      const response = await userRequest.post("/carts", {
        productId: item._id,
        quantity: 1,
      });

      if (response.status === 201) {
        setInCart(true);
        toast.success("Product added to cart successfully!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data === "Product already in cart"
      ) {
        toast.info("Product is already in the cart.");
      } else {
        toast.error("An error occurred while adding to cart.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl group">
        <img
          className="absolute top-0 right-0 h-full w-full object-cover transition-all duration-1000 group-hover:right-0"
          src={item.image}
          alt="product image"
        />

        <button
          onClick={() => setDialogOpen(true)}
          className="absolute inset-0 z-10"
        ></button>
      </div>
      {dialogOpen && (
        <div className="fixed inset-0 z-50 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl">
            <div className="flex items-center p-4 text-2xl font-semibold leading-snug text-blue-gray-900">
              <h1 className="capitalize">Product Name: {item.title}</h1>
            </div>
            <div className="relative p-4 text-base font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
              {item.description}
            </div>
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => setDialogOpen(false)}
                className="rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg active:opacity-85"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 px-5 pb-5">
        <h1 className="capitalize">Product Name: {item.title}</h1>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-xl font-semibold text-slate-900">
              Price: ${item.price}
            </span>
          </p>
        </div>
        <div>Categories: {item.categories}</div>
        <div>Color: {item.color}</div>
        <div>
          Available Stock: <span className="font-bold">{item.stock}</span>
        </div>
        <Button
          className="flex items-center justify-center bg-green-500 rounded-md px-5 py-2.5 text-center text-sm font-medium cursor-pointer mt-3"
          variant="secondary"
          text="Add to cart"
          onClick={handleAddToCart}
          disabled={item.stock === 0 || inCart}
        >
          {loading ? (
            <Loading />
          ) : inCart ? (
            "In Cart"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Product;
