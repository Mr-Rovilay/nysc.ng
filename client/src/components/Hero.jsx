import Button from "./Button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r h-screen bg-gray-100 text-white overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
        <h1 className="text-5xl text-black font-bold leading-tight mb-4">
          Welcome to Our Awesome Website
        </h1>
        <p className="text-lg text-gray-900 mb-8">
          Discover amazing features and services that await you.
        </p>
        <div className="inline-flex gap-3">
          <Button text={"shop now"} variant="primary" className={"bg-white"} />
          <a href="tel:+2348114080865">
            <Button text={"Call to Order Directly"} variant="secondary" />
          </a>
        </div>
        <p className="mt-4 text-black">or</p>
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
