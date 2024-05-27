import { useState } from "react";
import AnimationWrapper from "../src/common/AnimationWrapper";
import Announcement from "../src/components/Announcement";
import CustomNavbar from "../src/components/CustomNavbar";
import Footer from "../src/components/Footer";
import Products from "../src/components/Products";
import { Select, Option } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";

const ProductList = () => {
  const location = useLocation();
  const cat = location.pathname.split("/")[2];
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  const handleFilters = (value, filterType) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  return (
    <AnimationWrapper>
      <Announcement />
      <CustomNavbar />
      <div className="pt-20 max-h-screen py-6 px-6">
        <h1 className="D text-4xl font-bold p-5 ml-4 capitalize">
          Dresses: {cat ? cat : "All"}
        </h1>

        <div className="md:w-[92.2%] flex flex-col md:flex-row justify-between m-5">
          <div className="m-5 flex flex-col gap-4 md:flex-row md:items-center md:w-auto">
            <span className="text-xl font-semibold mr-5 mb-2 md:mb-0">
              Filter Products:
            </span>
            <div className="w-72 cursor-pointer hover:bg-gray-400 ">
              <Select
                onChange={(value) => handleFilters(value, "color")}
                name="color"
                label="Color"
                className="cursor-pointer"
              >
                <Option value="white">White</Option>
                <Option value="black">Black</Option>
                <Option value="red">Red</Option>
                <Option value="blue">Blue</Option>
                <Option value="yellow">Yellow</Option>
                <Option value="green">Green</Option>
              </Select>
            </div>
            <div className="w-72 cursor-pointer hover:bg-gray-400 ">
              <Select
                onChange={(value) => handleFilters(value, "size")}
                name="size"
                label="Size"
                className="cursor-pointer"
              >
                <Option value="XS">XS</Option>
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
              </Select>
            </div>
          </div>
          <div className="m-5 flex flex-col gap-4 md:flex-row md:items-center md:w-auto">
            <span className="text-xl font-semibold mr-5 mb-2 md:mb-0">
              Sort Products:
            </span>
            <div className="w-72">
              <Select
                onChange={(value) => setSort(value)}
                name="newest"
                label="Newest"
                className="cursor-pointer"
              >
                <Option value="asc">Price (asc)</Option>
                <Option value="desc">Price (desc)</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Products cat={cat} filters={filters} sort={sort} />
      <Footer />
    </AnimationWrapper>
  );
};

export default ProductList;
