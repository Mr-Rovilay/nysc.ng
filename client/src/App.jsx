import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import ProductList from "../pages/ProductList";
import CustomNavbar from "./components/CustomNavbar";

const App = () => {
  return (
    <div className="">
      <CustomNavbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </div>
  );
};

export default App;
