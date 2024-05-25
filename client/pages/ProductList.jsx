import AnimationWrapper from "../src/common/AnimationWrapper";
import Footer from "../src/components/Footer";
import Products from "../src/components/Products";
import { Select } from "@material-tailwind/react";

const ProductList = () => {
  return (
    <AnimationWrapper>
      <div className="pt-20 max-h-screen py-6 px-6">
        <h1 className="D text-4xl font-bold p-5 ml-4">Dresses</h1>
        <div className="md:w-[92.2%] flex flex-col md:flex-row justify-between m-5">
          <div className="m-5 flex flex-col gap-4 md:flex-row md:items-center md:w-auto">
            <span className="text-xl font-semibold mr-5 mb-2 md:mb-0">
              Filter Products:
            </span>
            <div className="w-72">
              <Select label="Color">
                <option>White</option>
                <option>Black</option>
                <option>Red</option>
                <option>Blue</option>
                <option>Yellow</option>
                <option>Green</option>
              </Select>
            </div>
            <div className="w-72 cursor-pointer hover:bg-gray-400 ">
              <Select label="Size" className="cursor-pointer">
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </Select>
            </div>
          </div>
          <div className="m-5 flex flex-col gap-4 md:flex-row md:items-center md:w-auto">
            <span className="text-xl font-semibold mr-5 mb-2 md:mb-0">
              Sort Products:
            </span>
            <div className="w-72">
              <Select label="Newest">
                <option>Price (asc)</option>
                <option>Price (desc)</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Products />
      <Footer />
    </AnimationWrapper>
  );
};

export default ProductList;
