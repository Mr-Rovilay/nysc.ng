import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Signup from "./components/Signup";
import ProductList from "../pages/ProductList";
import SingleProduct from "../pages/SingleProduct";
import CartPage from "../pages/CartPage";
import Signin from "./components/Signin";
import NotFoundPage from "../pages/NotFoundPage";
import CheckoutPage from "../pages/CheckoutPage";
export const url = "http://localhost:4000";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
