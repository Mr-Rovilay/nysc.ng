const Button = ({ text, variant, onClick }) => {
  return (
    <button
      className={`text-white font-semibold py-2 px-4 rounded ${
        variant === "primary" ? "bg-green-500" : "bg-green-500"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r h-screen text-white overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl text-black font-bold leading-tight mb-4">
          Welcome to Our Awesome Website
        </h1>
        <p className="text-lg text-gray-900 mb-8">
          Discover amazing features and services that await you.
        </p>
      </div>
    </div>
  );
};

export default Hero;
