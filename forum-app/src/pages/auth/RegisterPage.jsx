import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value })
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword){
      setError("Password do not match.");
      return;
    }

    const requestData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      type: "user",
    };
    
    console.log("Submitting registration data:", JSON.stringify(requestData));

    
  try {
    const response = await fetch("http://127.0.0.1:5009/users/register", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Registration failed");
    }

    setSuccess("✅ Registration successful! Redirecting to login...");

    // after registration, redirect to login page
    setTimeout(() => {
      navigate("/users/login", { state: { email: formData.email, password: formData.password } });
    }, 2000);

    } catch(err) {
      console.log("Registration Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Sign Up</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          autoComplete="off"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          autoComplete="off"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/users/login" className="text-blue-500 hover:underline">
          Log in here
        </Link>
      </p>
      <p className="text-center text-gray-600 mt-2">
        Need assistance?{" "}
        <Link to="/contactus" className="text-red-500 hover:underline">Contact Us</Link>
      </p>
    </div>
  </div>
);
};

export default RegisterPage;
