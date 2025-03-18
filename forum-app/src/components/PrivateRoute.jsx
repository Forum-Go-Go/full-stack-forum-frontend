import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/users/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />; // Redirect unauthorized users
  }

  return children;
};

export default ProtectedRoute;
