import Announcement from "../src/components/Announcement";
import Categories from "../src/components/Categories";
import Footer from "../src/components/Footer";
import Hero from "../src/components/Hero";
import Products from "../src/components/Products";

const HomePage = () => {
  return (
    <div className="">
      <Announcement />
      <Hero />
      <Categories />
      <Products />
      <Footer />
    </div>
  );
};

export default HomePage;
