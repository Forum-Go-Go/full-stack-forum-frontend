import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditPostForm = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('DRAFT');
//   const [image, setImage] = useState(null);
//   const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5002/posts/${postId}`);
        const post = response.data.post;
        setTitle(post.title);
        setContent(post.content);
        setStatus(post.status);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };

    fetchPost();
  }, [postId]);

//   const handleImageChange = (e) => setImage(e.target.files[0]);
//   const handleAttachmentsChange = (e) => setAttachments(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', status);

    //   if (image) formData.append('image', image);
    //   attachments.forEach((attachment, index) => {
    //     formData.append(`attachments[${index}]`, attachment);
    //   });

      await axios.put(`http://127.0.0.1:5009/posts/${postId}`, formData, {
        headers: {
        //   'Content-Type': 'multipart/form-data',
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

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 px-4 py-2 w-full border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="4" className="mt-1 px-4 py-2 w-full border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 px-4 py-2 w-full border rounded-md">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Add/Update Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 w-full text-sm border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Add Attachments</label>
          <input type="file" multiple onChange={handleAttachmentsChange} className="mt-1 w-full text-sm border rounded-md" />
        </div> */}
        <button type="submit" disabled={loading} className={`px-6 py-2 mt-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
          {loading ? 'Updating Post...' : 'Update Post'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default EditPostForm;
