import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserManagementPage from "./pages/auth/UserManagementPage";
import UserHomePage from "./pages/auth/UserHomePage";
import ContactUsPage from "./pages/auth/ContactUsPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import MessageManagementPage from "./pages/auth/MessageManagementPage";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/users/register" element={<RegisterPage />} />
      <Route path="/contactus" element={<ContactUsPage />} />{" "}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      {/* User Routes (Authenticated Users Only) */}
      <Route
        path="/home"
        element={
          // <PrivateRoute allowedRoles={["user", "admin"]}>
          <UserHomePage />
          // </PrivateRoute>
        }
      />
      {/* Admin Routes (Only Admins) */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes (Only Admins) */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MessageManagementPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
