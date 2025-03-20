import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserManagementPage from "./pages/auth/UserManagementPage";
import UserHomePage from "./pages/auth/UserHomePage";
import ContactUsPage from "./pages/auth/ContactUsPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import MessageManagementPage from "./pages/auth/MessageManagementPage";
import UserProfilePage from "./pages/auth/UserProfilePage";
import GlobalNavBar from "./components/GlobalNavBar";
import HistoryPage from "./pages/auth/HistoryPage";
import TopPostsPage from "./pages/auth/TopPostsPage";
import DraftsPage from "./pages/auth/DraftsPage";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      {/* ✅ Show Navbar only for authenticated users */}
      {isAuthenticated && <GlobalNavBar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/users/register" element={<RegisterPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* User Routes (Authenticated Users Only) */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowedRoles={["user", "admin", "super_admin"]}>
              <UserHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["user", "admin", "super_admin"]}>
              <UserProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/top-posts"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <TopPostsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/drafts"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <DraftsPage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes (Only Admins) */}
        <Route
          path="/user-management"
          element={
            <PrivateRoute allowedRoles={["admin","super_admin"]}>
              <UserManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute allowedRoles={["admin","super_admin"]}>
              <MessageManagementPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
