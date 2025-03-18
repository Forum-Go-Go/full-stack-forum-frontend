import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserManagementPage from "./pages/auth/UserManagementPage";
import MessagesPage from "./pages/auth/MessageManagementPage";
import UserHomePage from "./pages/auth/UserHomePage";
import ContactUsPage from "./pages/auth/ContactUsPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";


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
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
  );
};

export default App;
