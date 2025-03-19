import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost, archivePost, unarchivePost } from "../../redux/slices/userPostSlice.js";
import { useNavigate } from "react-router-dom";

const UserPostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [sortByDate, setSortByDate] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const sortedPosts = [...posts].sort((a, b) =>
    sortByDate
      ? new Date(b.post.dateCreated) - new Date(a.post.dateCreated)
      : new Date(a.post.dateCreated) - new Date(b.post.dateCreated)
  );

  const filteredPosts = sortedPosts.filter((post) =>
    post.post.title.toLowerCase().includes(titleFilter.toLowerCase())
  );

  const handleDelete = (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(postId));
    }
  };

  const handleArchive = (postId, isArchived) => {
    if (isArchived) {
      dispatch(unarchivePost(postId));
    } else {
      dispatch(archivePost(postId));
    }
  };

  const filterStatus = (status) => {
    const dict = {
        'PostStatus.ARCHIVED': "ARCHIVED",
        'PostStatus.DELETED': "DELETED",
        'PostStatus.PUBLISHED': "PUBLISHED",
        'PostStatus.UNPUBLISHED': "UNPUBLISHED",
        'PostStatus.DRAFT': "DRAFT",
    }
    return dict[status]
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Your Posts</h1>

      <button
        className="px-4 py-2 mb-4 bg-green-500 text-white rounded"
        onClick={() => navigate("/create-post")}
      >
        Create New Post
      </button>

      <input
        type="text"
        placeholder="Filter by title..."
        className="border p-2 mb-4 w-full max-w-md"
        value={titleFilter}
        onChange={(e) => setTitleFilter(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setSortByDate(!sortByDate)}
        >
          Sort by Date {sortByDate ? "⬆️" : "⬇️"}
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setTitleFilter("")}
        >
          Reset Filters
        </button>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col w-full max-w-3xl">
        {filteredPosts.map((postObj) => (
          <div key={postObj.post.id} className="flex flex-col p-4 border mb-4 rounded shadow">
            <h2 className="text-lg font-semibold">Title: {postObj.post.title}</h2>
            <p className="text-gray-600">Date Created: {postObj.post.dateCreated}</p>
            <p className="text-gray-800">Content: {postObj.post.content}</p>
            {postObj.post.images && <p>Images: {postObj.post.images}</p>}
            {postObj.post.attachments && <p>Attachments: {postObj.post.attachments}</p>}
            {postObj.post.status && <p>Status: {filterStatus(postObj.post.status)}</p>}

            <div className="flex gap-2 mt-4">
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded"
                onClick={() => navigate(`/edit-post/${postObj.post.id}`)}
              >
                Edit
              </button>

              <button
                className="px-3 py-1 bg-purple-500 text-white rounded"
                onClick={() => handleArchive(postObj.post.id, postObj.post.status === 'PostStatus.ARCHIVED')}
              >
                {postObj.post.status === 'PostStatus.ARCHIVED' ? "Unarchive" : "Archive"}
              </button>

              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(postObj.post.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPostPage;
