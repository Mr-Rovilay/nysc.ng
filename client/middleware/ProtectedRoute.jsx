import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  if (!isAuthenticated || (requiredRole && userInfo?.role !== requiredRole)) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
