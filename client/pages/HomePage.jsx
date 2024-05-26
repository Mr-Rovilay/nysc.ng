import AnimationWrapper from "../src/common/AnimationWrapper";
import Announcement from "../src/components/Announcement";
import Categories from "../src/components/Categories";
import CustomNavbar from "../src/components/CustomNavbar";
import Footer from "../src/components/Footer";
import Hero from "../src/components/Hero";
import Products from "../src/components/Products";

const HomePage = () => {
  return (
    <div className="">
      <AnimationWrapper>
        <Announcement />
        <CustomNavbar />
        <Hero />
        <Categories />
        <Products />
        <Footer />
      </AnimationWrapper>
    </div>
  );
};

export default HomePage;
