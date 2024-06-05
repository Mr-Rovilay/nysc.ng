import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Signup from "./components/Signup";
import ProductList from "../pages/ProductList";
import SingleProduct from "../pages/SingleProduct";
import CartPage from "../pages/CartPage";
import Signin from "./components/Signin";
import NotFoundPage from "../pages/NotFoundPage";
import CheckoutPage from "../pages/CheckoutPage";
import DeliveryInfoPage from "../pages/DeliveryInfoPage";
import CustomNavbar from "./components/CustomNavbar";
import UpdateProduct from "../pages/Admin/UpdateProduct";
import CreateProduct from "../pages/Admin/CreateProduct";
import DashboardLayout from "../Layout/DashboardLayout";
import DashBoard from "../pages/Admin/DashBoard";
import ManageProduct from "../pages/Admin/ManageProduct";
import Users from "../pages/Admin/Users";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      <ToastContainer />
      {!isAdminRoute && <CustomNavbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/delivery-info" element={<DeliveryInfoPage />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Admin Routes */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="users" element={<Users />} />
          <Route path="products/:productId/edit" element={<UpdateProduct />} />
          <Route path="manage-products" element={<ManageProduct />} />
          <Route path="" element={<DashBoard />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
