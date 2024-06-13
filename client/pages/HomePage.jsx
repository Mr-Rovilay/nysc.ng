import AnimationWrapper from "../src/common/AnimationWrapper";
import Categories from "../src/components/Categories";
import Footer from "../src/components/Footer";
import Hero from "../src/components/Hero";
import Products from "../src/components/Products";

const HomePage = () => {
  return (
    <div className="">
      <AnimationWrapper>
        <Hero />
      </AnimationWrapper>
      <AnimationWrapper>
        <Categories />
      </AnimationWrapper>
      <AnimationWrapper>
        <Products />
      </AnimationWrapper>
      <AnimationWrapper>
        <Footer />
      </AnimationWrapper>
    </div>
  );
};

export default HomePage;
