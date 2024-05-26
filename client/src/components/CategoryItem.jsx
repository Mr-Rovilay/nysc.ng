import { Link } from "react-router-dom";
import Button from "./Button";

const CategoryItem = ({ item }) => {
  return (
    <div className="relative flex-1 m-1 h-[50vh] md:h-[70vh]">
      <Link to={`/products/${item.category}`}>
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-5">
            {item.title}
          </h1>
          <Button
            text={"Shop Now"}
            variant="primary"
            className={"text-black bg-white hover:bg-gray-200"}
          />
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
