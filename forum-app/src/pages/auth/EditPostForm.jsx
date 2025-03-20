import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [postUserId, setPostUserId] = useState('');
  const [loading, setLoading] = useState(false);  // This loading state is for the form submission
  const [postLoading, setPostLoading] = useState(true);  // This loading state is for fetching the post
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setPostLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:5002/posts/${postId}`);
        const post = response.data.post;
        setTitle(post.title);
        setContent(post.content);
        setStatus(post.status);
        setPostUserId(post.userId);
      } catch (err) {
        setError('Error fetching post. Please try again.');
        console.error('Error fetching post:', err);
      } finally {
        setPostLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', status);

      await axios.put(`http://127.0.0.1:5009/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Post updated successfully!');
    } catch (err) {
      setError('Error updating post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (postLoading) {
    return <div className="text-center mt-10">Loading post...</div>;
  }

  return (
    <>
      {JSON.parse(localStorage.getItem("user")).id === postUserId ? (
        <div className="flex flex-col items-center p-6">
        <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={() => navigate('/')}
        >
            Back to Posts
        </button>
          <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
          <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 px-4 py-2 w-full border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="4"
                className="mt-1 px-4 py-2 w-full border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              {status === "Unpublished" && (<select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 px-4 py-2 w-full border rounded-md"
              >
                <option value="Unpublished">Draft</option>
                <option value="Published">Published</option>
              </select>)}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 mt-4 rounded-md text-white ${
                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Updating Post...' : 'Update Post'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      ) : (
        <>
        <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={() => navigate('/')}
        >
            Back to Posts
        </button>
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl text-red-500 font-semibold">You are not authorized to edit this post.</p>
        </div>
        </>
      )}
    </>
  );
};

export default EditPostForm;
