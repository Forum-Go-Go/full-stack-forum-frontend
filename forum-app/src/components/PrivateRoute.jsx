import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // console.log("Checking ProtectedRoute:");
  // console.log("isAuthenticated:", isAuthenticated);
  // console.log("User Role:", role);
  // console.log("Allowed Roles:", allowedRoles);

  if (!isAuthenticated) {
    // console.log("User not authenticated! Redirecting to login...");
    return <Navigate to="/users/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // console.log("User role not authorized! Redirecting to home...");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
