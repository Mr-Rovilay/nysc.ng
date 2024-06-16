import { motion } from "framer-motion";
import Button from "./Button"; // Import the Button component
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://edugist.org/wp-content/uploads/2023/05/NYSC-logo.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-75"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Our Awesome Website
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Discover amazing features and services that await you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link to={"/products"}>
            <Button text="Shop Now" variant="primary" className={"bg-white"} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
