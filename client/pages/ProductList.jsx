import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimationWrapper from "../src/common/AnimationWrapper";
import Footer from "../src/components/Footer";
import Products from "../src/components/Products";
import { Select, Option } from "@material-tailwind/react";

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const categoryFromUrl = query.get("category") || "";

  const [filters, setFilters] = useState({
    categories: categoryFromUrl,
  });
  const [sort, setSort] = useState("");

  // useEffect(() => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     categories: categoryFromUrl,
  //   }));
  // }, [categoryFromUrl]);

  const handleFilters = (value, filterType) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);

    if (filterType === "categories") {
      const newQuery = new URLSearchParams(location.search);
      newQuery.set("category", value);
      navigate(`${location.pathname}?${newQuery.toString()}`);
    }
  };

  const formatCategoryString = (category) => {
    if (!category) return "All";
    return category
      .replace(/%20/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <AnimationWrapper>
      <div className="container pt-20 px-6 mx-auto">
        <h1 className="text-xl md:text-4xl mb-8 font-bold capitalize">
          Dresses: {formatCategoryString(filters.categories)}
        </h1>

        <div className="md:w-full md:max-w-5xl mx-auto flex flex-col md:flex-row justify-between md:px-6 md:py-4 md:space-x-4">
          <div className="flex flex-col gap-4 md:w-1/2">
            <span className="text-xl font-semibold mr-5 md:mb-0">
              Filter Products:
            </span>
            <div className="w-full md:w-72 cursor-pointer hover:bg-gray-400">
              <Select
                onChange={(value) => handleFilters(value, "color")}
                name="color"
                label="Color"
                className="cursor-pointer"
              >
                <Option value="">Default</Option>
                <Option value="white">White</Option>
                <Option value="black">Black</Option>
                <Option value="red">Red</Option>
                <Option value="blue">Blue</Option>
                <Option value="yellow">Yellow</Option>
                <Option value="green">Green</Option>
              </Select>
            </div>
            <div className="w-full md:w-72 cursor-pointer hover:bg-gray-400">
              <Select
                onChange={(value) => handleFilters(value, "size")}
                name="size"
                label="Size"
                className="cursor-pointer"
              >
                <Option value="">Default</Option>
                <Option value="XS">XS</Option>
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:w-1/2">
            <span className="text-xl font-semibold mr-5 md:mb-0">Sort:</span>
            <div className="w-full md:w-72">
              <Select
                onChange={(value) => setSort(value)}
                name="newest"
                label="Newest"
                className="cursor-pointer"
              >
                <Option value="">Default</Option>
                <Option value="asc">Price (lowest)</Option>
                <Option value="desc">Price (highest)</Option>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:w-1/2">
            <span className="text-xl font-semibold mr-5 mb-2 md:mb-0">
              Categories:
            </span>
            <div className="w-full md:w-72">
              <Select
                onChange={(value) => handleFilters(value, "categories")}
                name="categories"
                label="Categories"
                className="cursor-pointer"
                value={filters.categories}
              >
                <Option value="">All</Option>
                <Option value="Female">Female</Option>
                <Option value="Male">Male</Option>
                <Option value="Male & Female">Male & Female</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8">
        <Products
          categories={filters.categories}
          filters={filters}
          sort={sort || "newest"} // Handle default sort
        />
      </div>
      <Footer />
    </AnimationWrapper>
  );
};

export default ProductList;
