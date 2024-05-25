import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Signup from "./components/Signup";
import ProductList from "../pages/ProductList";
import CustomNavbar from "./components/CustomNavbar";
import SingleProduct from "../pages/SingleProduct";
import CartPage from "../pages/CartPage";
import Announcement from "./components/Announcement";
import Signin from "./components/Signin";

const App = () => {
  return (
    <div className="">
      <Announcement />
      <CustomNavbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/singleProduct" element={<SingleProduct />} />
      </Routes>
    </div>
  );
};

export default App;
