import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const UserProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please log in.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded JWT:", decodedToken);

      const userId = decodedToken.user_id;  
      if (!userId) {
        throw new Error("Invalid JWT: user_id is missing.");
      }

      fetchUserProfile(userId);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      setError("Invalid token. Please log in again.");
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5009/users/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserProfile(response.data.user);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to load profile.");
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile((prev) => ({
          ...prev,
          profileImageURL: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const userId = jwtDecode(token).user_id;

      await axios.put(`http://127.0.0.1:5009/users/${userId}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile image updated successfully!");
      setUploading(false);
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to update profile image.");
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-700 text-center">User Profile</h2>

      <div className="flex flex-col items-center mt-6">
        <img
          src={userProfile.profileImageURL}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
        />
        <h3 className="mt-4 text-xl font-medium text-gray-800">
          {userProfile.firstName} {userProfile.lastName}
        </h3>
        <p className="text-gray-500">{userProfile.email}</p>
        <p className="text-sm text-gray-400">Joined on {userProfile.dateJoined}</p>
        <span className="mt-2 px-4 py-1 bg-blue-500 text-white text-sm rounded-lg">
          {userProfile.type.toUpperCase()}
        </span>

        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Choose New Profile Image
          </label>

          {selectedFile && (
            <button
              onClick={handleUpload}
              className="ml-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Activity</h3>
        <div className="mt-4 space-y-2">
          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="font-medium text-gray-800">Top Posts</h4>
            {userProfile.topPosts.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600">
                {userProfile.topPosts.map((post, index) => (
                  <li key={index}>{post}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No top posts yet.</p>
            )}
          </div>

          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="font-medium text-gray-800">Drafts</h4>
            {userProfile.drafts.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600">
                {userProfile.drafts.map((draft, index) => (
                  <li key={index}>{draft}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No drafts saved.</p>
            )}
          </div>

          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="font-medium text-gray-800">View History</h4>
            {userProfile.viewHistory.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600">
                {userProfile.viewHistory.map((view, index) => (
                  <li key={index}>{view}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No view history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
