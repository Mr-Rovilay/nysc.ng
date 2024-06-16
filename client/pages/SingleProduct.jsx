import Button from "../src/components/Button";
import AnimationWrapper from "../src/common/AnimationWrapper";
import { Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { publicRequest, userRequest } from "../middleware/middleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../src/components/Loading";
import { AuthContext } from "../middleware/AuthContext";
import useCart from "../middleware/useCart";

const SingleProduct = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { cart, refetch } = useCart();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Navigate("/signin");
      return;
    }

    setLoading(true);

    try {
      const response = await userRequest.post("/carts", {
        productId: id,
        quantity: quantity,
      });

      if (response.status === 201) {
        setInCart(true);
        refetch(cart);
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
    <AnimationWrapper>
      <ToastContainer />
      <div className="container max-h-screen bg-gray-100 py-12">
        <div className="max-w-6xl flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="h-[600px] md:h-[800px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                <img
                  className="object-cover rounded-lg mt-4 w-full h-full"
                  src={product.image}
                  alt={product.title}
                />
              </div>
              <div className="flex items-center justify-center mt-4">
                <Button
                  className="flex items-center justify-center bg-green-500 rounded-md px-5 py-2.5 text-center text-sm font-medium cursor-pointer mt-3"
                  variant="secondary"
                  text="Add to cart"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || inCart}
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
            <div className="md:flex-1 px-4 mt-6 md:mt-0">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 capitalize">
                {product.title}
              </h2>
              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Price:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">
                    ₦{product.price}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Availability:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Select Color:
                </span>
                <div className="">{product.color}</div>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Select Size:
                </span>
                {product.size}
              </div>
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Product Description:
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 capitalize">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default SingleProduct;
