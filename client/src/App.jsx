import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Signup from "./components/Signup";
import ProductList from "../pages/ProductList";
import SingleProduct from "../pages/SingleProduct";
import CartPage from "../pages/CartPage";
import Signin from "./components/Signin";
import NotFoundPage from "../pages/NotFoundPage";
import CheckoutPage from "../pages/CheckoutPage";
import CustomNavbar from "./components/CustomNavbar";
import AuthProvider from "../middleware/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
