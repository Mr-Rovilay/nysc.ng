import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="container bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-lg max-w-4xl p-8"
      >
        <div className="texxt-left">
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
          <h2 className="text-2xl font-semibold mb-4">Connect with Me</h2>
          <div className="flex justify-center space-x-4">
            <a href="#" aria-label="Facebook">
              <FaFacebook className="w-8 h-8 text-blue-600" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="w-8 h-8 text-pink-600" />
            </a>
            <a href="#" aria-label="Twitter">
              <FaXTwitter className="w-8 h-8 " />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
