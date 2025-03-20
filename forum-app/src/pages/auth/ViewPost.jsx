import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5002/posts/${postId}`);
        setPost(response.data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Error fetching post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div className="text-center mt-10">Loading post...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center mt-10">Post not found.</div>;
  console.log(post)
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-500 text-sm mb-4">Created on: {post.dateCreated}</p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Status:</span> {post.status}
        </p>
        <div className="prose max-w-none text-gray-800 mb-6">Content: {post.content}</div>

        {post.images && post.images.length > 0 && (
        <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Image</h3>
            <div className="flex justify-center">
            <img
                src={post.images[0]}
                alt="Post image"
                className="rounded-lg shadow hover:scale-105 transition-transform duration-300 max-h-[400px] object-contain"
            />
            </div>
        </div>
)}


        {/* {post.attachments && post.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Attachments</h3>
            <ul className="list-disc list-inside text-blue-600">
              {post.attachments.map((file, idx) => (
                <li key={idx}>
                  <a href={file} target="_blank" rel="noopener noreferrer" className="underline">
                    Download Attachment {idx + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )} */}

        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={() => navigate('/')}
          >
            Back to Posts
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600"
            onClick={() => navigate(`/edit-post/${post.id}`)}
          >
            Edit Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;

