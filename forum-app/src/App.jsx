import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserManagementPage from "./pages/auth/UserManagementPage";
import MessagesPage from "./pages/auth/MessageManagementPage";
import UserHomePage from "./pages/auth/UserHomePage";
import ContactUsPage from "./pages/auth/ContactUsPage";
import ProtectedRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/users/register" element={<RegisterPage />} />

      {/* User Routes (Authenticated Users Only) */}
      <Route
        path="/home"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <UserHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/contactus"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <ContactUsPage />
          </PrivateRoute>
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
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
