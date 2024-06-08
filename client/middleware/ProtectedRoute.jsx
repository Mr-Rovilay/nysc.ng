import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  redirectPath = "/",
}) => {
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    console.error("ProtectedRoute: User is not authenticated.");
    return <Navigate to={redirectPath} />;
  }

  // Check if the user is an admin if required
  if (requireAdmin && !userInfo?.isAdmin) {
    console.warn("ProtectedRoute: User does not have admin access.");
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedRoute;