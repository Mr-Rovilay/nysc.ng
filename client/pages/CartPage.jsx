import { IoMdAdd } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import AnimationWrapper from "../src/common/AnimationWrapper";

const CartPage = () => {
  return (
    <AnimationWrapper>
      <div className="min-h-screen bg-gray-100">
        <div className="p-5 sm:p-2">
          <h1 className="text-3xl font-light text-center mb-8">YOUR CART</h1>
          <div className="flex flex-col items-center sm:flex-row justify-between p-5 bg-white rounded-lg shadow-md mb-8">
            <Link to={"/products"}>
              <button className="px-4 py-2 font-semibold border border-gray-300 rounded-lg bg-transparent hover:bg-gray-100 transition duration-300 mb-2 sm:mb-0">
                CONTINUE SHOPPING
              </button>
            </Link>
            <div className="sm:flex sm:items-center">
              <div className="underline cursor-pointer mx-2 mb-2 sm:mb-0">
                Shopping Bag(2)
              </div>
              <div className="underline cursor-pointer mx-2">
                Your Wishlist (0)
              </div>
            </div>
            <button className="px-4 py-2 font-semibold text-white bg-black rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
              CHECKOUT NOW
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-5">
            <div className="flex-3 bg-white rounded-lg shadow-md p-5">
              <div className="flex flex-col md:flex-row justify-between mb-5">
                <div className="flex-1 space-y-8 border border-gray-300 rounded-lg p-5 bg-white shadow-md">
                  <img
                    className="w-52 rounded-lg"
                    src="https://i.pinimg.com/originals/2d/af/f8/2daff8e0823e51dd752704a47d5b795c.png"
                    alt="Product"
                  />
                  <div className="p-5 flex flex-col justify-around">
                    <span className="font-semibold">
                      Product: JESSIE THUNDER SHOES
                    </span>
                    <span className="text-gray-600">ID: 93813718293</span>
                    <div className="w-5 h-5 rounded-full bg-black"></div>
                    <span className="text-gray-600">Price: $3700.5</span>
                    <span className="text-gray-600">Size: 37.5</span>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="flex items-center mb-5">
                        <div className="text-2xl cursor-pointer">
                          <IoIosRemoveCircleOutline />
                        </div>
                        <div className="text-2xl mx-2">2</div>
                        <div className="text-2xl cursor-pointer">
                          <IoMdAdd />
                        </div>
                      </div>
                      <div className="text-3xl font-light">$ 30</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-5">
                <div className="flex-1 space-y-8 border border-gray-300 rounded-lg p-5 bg-white shadow-md">
                  <img
                    className="w-52 rounded-lg object-cover"
                    src="https://i.pinimg.com/originals/2d/af/f8/2daff8e0823e51dd752704a47d5b795c.png"
                    alt="Product"
                  />
                  <div className="p-5 flex flex-col justify-around">
                    <span className="font-semibold">
                      Product: JESSIE THUNDER SHOES
                    </span>
                    <span className="text-gray-600">ID: 93813718293</span>
                    <div className="w-5 h-5 rounded-full bg-black"></div>
                    <span className="text-gray-600">Price: $3700.5</span>
                    <span className="text-gray-600">Size: 37.5</span>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="flex items-center mb-5">
                        <div className="text-2xl cursor-pointer">
                          <IoIosRemoveCircleOutline />
                        </div>
                        <div className="text-2xl mx-2">2</div>
                        <div className="text-2xl cursor-pointer">
                          <IoMdAdd />
                        </div>
                      </div>
                      <div className="text-3xl font-light">$ 30</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-8 border border-gray-300 rounded-lg p-5 bg-white shadow-md">
              <h1 className="text-2xl font-light mb-5">ORDER SUMMARY</h1>
              <div className="flex justify-between my-5 text-base">
                <span>Subtotal</span>
                <span>$ 80</span>
              </div>
              <div className="flex justify-between my-5 text-base">
                <span>Estimated Shipping</span>
                <span>$ 5.90</span>
              </div>
              <div className="flex justify-between my-5 text-base">
                <span>Shipping Discount</span>
                <span>$ -5.90</span>
              </div>
              <div className="flex justify-between my-5 text-xl font-medium">
                <span>Total</span>
                <span>$ 80</span>
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
