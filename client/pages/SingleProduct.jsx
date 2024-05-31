import Footer from "../src/components/Footer";
import Button from "../src/components/Button";
import AnimationWrapper from "../src/common/AnimationWrapper";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../middleware/middleware";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleProduct = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get(`/products/${id}`);
        setProduct(res.data);
        // Check if the product is already in the cart
        const cartRes = await userRequest.get("/carts");
        const cartItems = cartRes.data;
        const isInCart = cartItems.some((item) => item.productId === id);
        setInCart(isInCart);
      } catch (error) {
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!inCart) {
        const response = await userRequest.post("/carts", {
          productId: id,
          quantity: quantity,
        });
        console.log(response.data);
        toast.success("Product added to cart successfully!");
        setInCart(true);
        updateCartCount();
      } else {
        toast.warning("Product is already in the cart!");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const updateCartCount = async () => {
    try {
      const cartRes = await userRequest.get("/carts");
      const cartItems = cartRes.data;
      const cartCount = cartItems.length;
      document.getElementById("cart-count").textContent = cartCount;
    } catch (error) {
      console.error("Error updating cart count:", error);
    }
  };

  return (
    <AnimationWrapper>
      <ToastContainer />
      <div className="max-h-screen bg-gray-100 dark:bg-gray-800 py-8">
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
                <div className="px-2 mt-4" onClick={handleAddToCart}>
                  <Button
                    text={inCart ? "Product in Cart" : "Add to Cart"}
                    variant="secondary"
                    disabled={inCart}
                  />
                </div>
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
                    ${product.price}
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
                  Select Color:{""}
                </span>
                <div className="">{product.color}</div>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Select Size:{""}
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
      <Footer />
    </AnimationWrapper>
  );
};

export default SingleProduct;
