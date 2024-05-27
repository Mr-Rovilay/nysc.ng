import { TiShoppingCart } from "react-icons/ti";
import { CiSearch } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
const Product = ({ item }) => {
  return (
    <div className="flex flex-col items-center justify-center relative m-5 min-w-[280px] h-[350px] bg-blue-100">
      <div className="rounded-full bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <img src={item.image} className="h-3/4 z-100" alt="Product" />
      <div className="opacity-0 w-full h-full absolute top-0 left-0 bg-black bg-opacity-20 flex items-center justify-center transition-all duration-500 cursor-pointer hover:opacity-100">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full mr-3 transition-all duration-500 hover:bg-blue-200">
            <TiShoppingCart className="text-gray-700" />
          </div>
          <Link to={`/product/${item._id}`}>
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full mr-3 transition-all duration-500 hover:bg-blue-200">
              <CiSearch className="text-gray-700" />
            </div>
          </Link>
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full transition-all duration-500 hover:bg-blue-200">
            <FaRegHeart className="text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
