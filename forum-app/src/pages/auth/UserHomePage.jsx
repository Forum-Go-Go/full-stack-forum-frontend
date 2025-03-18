import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/slices/postSlice.js";

const UserHomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [sortByDate, setSortByDate] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const sortedPosts = [...posts].sort((a, b) =>
    sortByDate
      ? new Date(b.dateCreated) - new Date(a.dateCreated)
      : new Date(a.dateCreated) - new Date(b.dateCreated)
  );

  const filteredPosts = sortedPosts.filter((post) =>
    post.post.title.toLowerCase().includes(titleFilter.toLowerCase())
  );

  console.log(posts);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Published Posts</h1>
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

      {/* Loading & Error Handling */}
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col w-full max-w-3xl">
        {filteredPosts.map((post) => (
          <div key={post.post.id} className="flex flex-col p-4 border mb-2">
            <h2 className="text-lg font-semibold">{post.post.title}</h2>
            <p className="text-gray-600">{post.post.dateCreated}</p>
            <p className="text-gray-800">{post.post.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHomePage;
