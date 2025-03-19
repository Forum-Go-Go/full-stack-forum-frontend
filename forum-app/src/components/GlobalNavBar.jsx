import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "../redux/slices/authSlice";

const GlobalNavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("❌ No token found in localStorage.");
      return;
    }

    try {
      // ✅ Decode JWT and extract user info
      const decodedToken = jwtDecode(token);
      console.log("Decoded JWT:", decodedToken);

      // ✅ Check if email exists in JWT
      if (!decodedToken.email) {
        console.warn("No email found in JWT payload!");
      }

      setUserData({
        email: decodedToken.email, // Fallback if missing
        role: decodedToken.role || "user", // Default to 'user'
      });

      console.log("Set userData:", {
        email: decodedToken.email,
        role: decodedToken.role || "user",
      });
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      localStorage.removeItem("token");
      setUserData(null);
    }
  }, []);

  // Hide Navbar if no user data (not logged in)
  if (!userData) {
    console.log("Hiding Navbar: No user data available.");
    return null;
  }

  // Logout Function
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/users/login");
  };

  // Define navigation items based on user role
  const normalUserNav = [
    { path: "/home", label: "Home" },
    { path: "/profile", label: "Profile" },
    { path: "/create-post", label: "Create New Post" },
    { path: "/contactus", label: "Contact Us" },
  ];

  const adminNav = [
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/post-manageent", label: "Post Management" },
    { path: "/user-management", label: "User Management" },
    { path: "/messages", label: "Messages Management" },
  ];

  const superAdminNav = [
    { path: "/promote-user", label: "Promote User" },
    { path: "/post-manageent", label: "Post Management" },
    { path: "/user-management", label: "User Management" },
  ];

  // Determine Navigation Items Based on Role
  let navItems = normalUserNav;
  if (userData.role === "admin") {
    navItems = adminNav;
  } else if (userData.role === "super_admin") {
    navItems = superAdminNav;
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-indigo-600 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: App Name */}
        <Link
          to="/home"
          className="text-3xl font-semibold hover:text-indigo-300 transition duration-200"
        >
          Forum
        </Link>

        {/* Center: Navigation Links */}
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="hover:text-indigo-300 transition duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side: User Info & Logout */}
        <div className="flex items-center space-x-5">
          {/* Display user email & role */}
          <span className="text-sm font-medium">
            {userData.email} ({userData.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default GlobalNavBar;
