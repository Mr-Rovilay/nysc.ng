import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-lg max-w-4xl p-8"
      >
        <div className="text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full shadow-lg mb-4"
          />
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-lg text-gray-700 mb-6">
            Hello! I'm Maria Akinola, the owner of Nysc Kit, an online
            destination for fashion enthusiasts. With a passion for curating the
            latest trends, we specialize in offering high-quality clothing,
            accessories, and fashion-related products to our valued customers.
          </p>
        </div>
        <div className="text-left">
          <h2 className="text-2xl font-semibold mb-4">Our Role in Fashion</h2>
          <p className="text-lg text-gray-700 mb-6">
            As a fashion retailer, our role extends beyond selling. We curate
            trends, understand consumer preferences, and create memorable
            shopping experiences. By staying ahead of trends and connecting with
            our audience, we foster a vibrant community of fashion enthusiasts.
          </p>
          <h2 className="text-2xl font-semibold mb-4">
            Supporting Innovation and Sustainability
          </h2>
          <p className="text-lg text-gray-700">
            We embrace innovation in digital marketing, sustainable practices,
            and technology to enhance our offerings. Supporting emerging
            designers and brands is also crucial to enriching our product
            selection and contributing to industry diversity.
          </p>
        </div>
        <div className="text-center mt-8">
          <h2 className="text-2xl font-semibold mb-4">Connect with Us</h2>
          <div className="flex justify-center space-x-4">
            <a
              href="https://instagram.com"
              className="text-gray-500 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12 6.63 0 12-5.37 12-12C24 5.37 18.63 0 12 0zM14.963 7.5H12.75c-.375 0-.75.375-.75.75v1.5h2.25v2.25h-2.25v6h-2.25v-6h-1.5v-2.25h1.5V8.25C10.5 7.875 11.25 7.5 12 7.5h2.963z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              className="text-gray-500 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12 6.63 0 12-5.37 12-12C24 5.37 18.63 0 12 0zM14.963 7.5H12.75c-.375 0-.75.375-.75.75v1.5h2.25v2.25h-2.25v6h-2.25v-6h-1.5v-2.25h1.5V8.25C10.5 7.875 11.25 7.5 12 7.5h2.963z" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
