import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRequest } from "../../middleware/middleware";
import { useEffect, useState } from "react";

const Product = ({ item }) => {
  const [inCart, setInCart] = useState(false);

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
    try {
      const response = await userRequest.post("/carts", {
        productId: item._id,
        quantity: 1,
      });

      if (response.status === 201) {
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
    }
  };

  return (
    <div className="product-card my-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <ToastContainer />
      <div className="product-image-container relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="product-image peer absolute top-0 right-0 h-full w-full object-cover"
          src="https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b"
          alt="product image"
        />
        <img
          className="product-image peer absolute top-0 -right-96 h-full w-full object-cover transition-all delay-100 duration-1000 hover:right-0 peer-hover:right-0"
          src={item.image}
          alt="product image"
        />
        <svg
          className="add-to-cart-icon pointer-events-none absolute inset-x-0 bottom-5 mx-auto text-3xl text-white transition-opacity group-hover:animate-ping group-hover:opacity-30 peer-hover:opacity-0"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M2 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v10a4 4 0 0 1-2.328 3.635a2.996 2.996 0 0 0-.55-.756l-8-8A3 3 0 0 0 14 17v7H6a4 4 0 0 1-4-4V10Zm14 19a1 1 0 0 0 1.8.6l2.7-3.6H25a1 1 0 0 0 .707-1.707l-8-8A1 1 0 0 0 16 17v12Z"
          />
        </svg>
      </div>
      <div className="mt-4 px-5 pb-5">
        <div>
          <h5 className="text-xl tracking-tight text-slate-900">
            {item.title}
          </h5>
        </div>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">
              {item.price}
            </span>
            <span className="text-sm text-slate-900 line-through">
              {item.price}
            </span>
          </p>
        </div>
        <div className="">Categories: {item.categories}</div>
        <div className="">Color: {item.color}</div>
        <div className="">Stock {item.stock}</div>

        <button
          className="flex items-center justify-center rounded-md px-5 py-2.5 text-center text-sm font-medium btn bg-black text-white hover:bg-dark-green cursor-pointer"
          onClick={handleAddToCart}
          disabled={item.stock === 0 || inCart}
        >
          {inCart ? (
            "In Cart"
          ) : (
            <>
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
              Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Product;
