import { Route, Routes } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import Signup from "./components/Signup";
import Signin from "./components/Signin";

const App = () => {
  return (
    <div className="app">
      <CustomNavbar />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </div>
  );
};

export default App;
