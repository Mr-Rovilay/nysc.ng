import Button from "./Button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r h-screen bg-gray-100 text-white overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
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
          <Button
            variant={"secondary"}
            text={"Send Message on WhatsApp"}
            href="https://api.whatsapp.com/send?text=text&phone=+2348140570029"
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
