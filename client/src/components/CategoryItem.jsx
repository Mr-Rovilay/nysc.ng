import { Link } from "react-router-dom";
import Button from "./Button";
import { motion } from "framer-motion";

const CategoryItem = ({ item }) => {
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const imageVariants = {
    hover: { scale: 1.05 },
  };

  return (
    <motion.div
      className="relative flex-1 m-1 md:m-2 h-[50vh] md:h-[70vh]"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={`/products?category=${item.categories}`}>
        <motion.img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg"
          variants={imageVariants}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <h1 className="text-white text-xl md:text-3xl font-bold mb-3 md:mb-5 px-4 text-center">
            {item.title}
          </h1>
          <Button text={"Shop Now"} variant="secondary" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryItem;
