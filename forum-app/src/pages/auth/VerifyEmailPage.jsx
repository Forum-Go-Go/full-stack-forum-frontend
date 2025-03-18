import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import axios from "axios";

const VERIFY_REQUEST_URL = "http://127.0.0.1:5009/users/verify_email/request";
const VERIFY_URL = "http://127.0.0.1:5009/users/verify_email";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const email = location.state?.email; // get email
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("Send Verification Code"); // default button text
  const [error, setError] = useState(null);

  // Check if the user is already verified when the page loads
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.verified) {
      navigate("/home");
    }
  }, [navigate]);

  // Request a new verification code
  const requestVerificationCode = async () => {
    try {
      const response = await axios.post(VERIFY_REQUEST_URL, { email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setMessage(response.data.message || "Resend Verification Code");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request verification code.");
    }
  };

  // Submit the verification code
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(VERIFY_URL, { email, code: verificationCode }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      alert(response.data.message);
      
      // Update local storage to mark user as verified
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), verified: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      // Update Redux store to reflect verification status
      dispatch(login({ user: updatedUser, token: localStorage.getItem("token") }));
  
      setTimeout(() => {
        navigate("/home");
      }, 200);  // Delayed navigation to prevent race conditions
    } catch (err) {
      setError(err.response?.data?.error || "Invalid verification code.");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="text-gray-600 text-center mb-4">
          A verification code has been sent to <strong>{email}</strong>
        </p>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            name="verificationCode"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Verify Email
          </button>
        </form>

        <button onClick={requestVerificationCode} className="mt-4 text-blue-500 w-full">
          {message}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
