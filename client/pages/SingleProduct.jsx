import { IoMdAdd } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import Footer from "../src/components/Footer";
import Button from "../src/components/Button";
import AnimationWrapper from "../src/common/AnimationWrapper";
import CustomNavbar from "../src/components/CustomNavbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../src/middleware";
import { Select, Option } from "@material-tailwind/react";

const SingleProduct = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

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

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  const handleColorChange = (value) => {
    setColor(value);
  };

  const handleSizeChange = (value) => {
    setSize(value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const handleClick

  return (
    <AnimationWrapper>
      <CustomNavbar />
      <div className="D app max-h-screen bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="h-[600px] md:h-[800px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                <img
                  className="w-full h-full object-cover rounded-lg mt-4"
                  src={product.image}
                  alt={product.title}
                />
              </div>
              <div className="flex items-center justify-center mt-4">
                <div className="w-1/2 px-2 mt-4">
                  <Button
                    text={"Add to Cart"}
                    variant="secondary"
                    onClick={handleClick}
                  />
                </div>
                <div className="flex items-center font-bold pt-3">
                  <div
                    className="text-2xl cursor-pointer"
                    onClick={() => handleQuantityChange("decrement")}
                  >
                    <IoIosRemoveCircleOutline />
                  </div>
                  <span className="w-8 h-8 border border-teal-500 flex items-center justify-center mx-1 rounded-md">
                    {quantity}
                  </span>
                  <div
                    className="text-2xl cursor-pointer"
                    onClick={() => handleQuantityChange("increment")}
                  >
                    <IoMdAdd />
                  </div>
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
                  Select Color:
                </span>
                <div className="">
                  <Select
                    onChange={(value) => handleColorChange(value)}
                    name="color"
                    label="Color"
                    className="cursor-pointer"
                  >
                    {product.color?.map((color) => (
                      <Option key={color} value={color}>
                        {color}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Select Size:
                </span>
                <Select
                  onChange={(value) => handleSizeChange(value)}
                  name="size"
                  className="cursor-pointer"
                >
                  {product.size?.map((size) => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
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
