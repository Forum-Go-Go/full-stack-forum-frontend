import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePostForm = () => {
  // State to manage form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Unpublished"); // Default status is 'Unpublished'
  const [image, setImage] = useState(null); // State for image upload
  const [attachments, setAttachments] = useState([]); // State for multiple attachments
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize navigate hook
  const navigate = useNavigate();

  // Handle form input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Handle attachments upload (multiple files)
  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setLoading(true); // Start loading state

    // const newPost = {
    //   title,
    //   content,
    //   status,
    //   image, // Add the image file
    //   attachments, // Add attachments files
    // };

    console.log("Selected status:", status); // Debugging: check the selected status

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status); // Pass the status as selected

      if (image) {
        formData.append("image", image); // Add image file to FormData
      }

      // Add attachments to FormData
      attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}]`, attachment);
      });

      const response = await axios.post(
        "http://127.0.0.1:5009/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Post created successfully:", response.data);

      // Show success alert
      alert("Post has been created successfully!");

      // Redirect to user-posts page (or wherever you want to navigate)
      navigate("/user-posts"); // Update this path if necessary

      // Optionally reset form or show success message
      setTitle("");
      setContent("");
      setStatus("Unpublished");
      setImage(null);
      setAttachments([]);
    } catch (err) {
      setError("Error creating post. Please try again.");
      console.error(err);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex flex-col items-center mt-16 p-6">
      <h2 className="text-3xl font-bold mb-6 font-lato">Create a New Post</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-lg space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
            className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={content}
            onChange={handleContentChange}
            required
            rows="4"
            className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Unpublished">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Post Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 w-full text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attachments upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachments
          </label>
          <input
            type="file"
            multiple
            onChange={handleAttachmentsChange}
            className="mt-1 w-full text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 mt-4 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } focus:outline-none`}
        >
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>

      {/* Error message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default CreatePostForm;
