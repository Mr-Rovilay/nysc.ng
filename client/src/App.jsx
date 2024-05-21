import { Route, Routes } from "react-router-dom";
import Pay from "./Pay";
import Success from "./Success";
import Cancle from "./cancle";
const App = () => {
  return (
    <Routes>
      <Route path="/pay" element={<Pay />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancle" element={<Cancle />} />
    </Routes>
  );
};

export default App;
