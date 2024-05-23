import Button from "./Button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://nyscwhatsappgroup.com/wp-content/uploads/2024/02/NYSC-essential-items.jpg"
          alt="Background Image"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Welcome to Our Awesome Website
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Discover amazing features and services that await you.
        </p>
        <div className="inline-flex gap-3">
          <Button text={"Get started"} variant="primary" />
          <a href="tel:+2348114080865">
            <Button text={"Call to order directly"} variant="secondary" />
          </a>
        </div>
        <p className="mt-4">or</p>
        <div className="mt-4">
          <a
            href="https://api.whatsapp.com/send?phone=+2348114080865"
            className="bg-green-500 text-white hover:bg-green-400 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Send Message on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
