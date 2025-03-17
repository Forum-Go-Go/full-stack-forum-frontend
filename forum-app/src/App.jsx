import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UserManagementPage from "../pages/auth/UserManagementPage";
import MessagesPage from "../pages/auth/MessageManagementPage";
import UserHomePage from "../pages/auth/UserHomePage";
import ContactUsPage from "../pages/auth/ContactUsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/users/register" element={<RegisterPage />} />
        <Route path="/home" element={<UserHomePage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
