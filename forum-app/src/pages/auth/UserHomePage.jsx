import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/slices/postSlice.js";
import { fetchUser } from "../../redux/slices/userSlice.js";

const UserHomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const users = useSelector((state) => state.user?.users || {}); // Ensure users is always an object
  const userError = useSelector((state) => state.user?.error); // Capture user fetch errors
  const [sortByDate, setSortByDate] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");
  const [sortedPosts, setSortedPosts] = useState([]);

  useEffect(() => {
    dispatch(fetchPosts())
      .unwrap()
      .then((posts) => {
        const uniqueUserIds = [
          ...new Set(posts.map((post) => post.post.userId)),
        ];

        uniqueUserIds.forEach((userId) => {
          if (userId) {
            dispatch(fetchUser(userId));
          }
        });
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      const sorted = [...posts].sort((a, b) =>
        sortByDate
          ? new Date(b.post?.dateCreated) - new Date(a.post?.dateCreated)
          : new Date(a.post?.dateCreated) - new Date(b.post?.dateCreated)
      );
      setSortedPosts(sorted);
    }
  }, [posts, sortByDate]);

  const filteredPosts = sortedPosts.filter((post) => {
    return post?.post?.title?.toLowerCase().includes(titleFilter.toLowerCase());
  });

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
          onClick={() => setSortByDate((prev) => !prev)}
        >
          Sort by Date {sortByDate ? "⬆️" : "⬇️"}
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => {
            setTitleFilter("");
            setSortByDate(true);
          }}
        >
          Reset Filters
        </button>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {userError && (
        <p className="text-red-500">User fetch error: {userError}</p>
      )}

      <div className="flex flex-col w-full max-w-3xl">
        {filteredPosts.length === 0 ? (
          <p className="text-gray-600 text-center">No published posts found.</p>
        ) : (
          filteredPosts.map((post) => {
            const user = users[post.post.userId] || {
              firstName: null,
              lastName: null,
            };

            return (
              <div
                key={post.post.id}
                className="flex flex-col p-4 border mb-2 rounded shadow-md bg-white"
              >
                <h2 className="text-lg font-semibold text-blue-700">
                  {post.post.title}
                </h2>
                <p className="text-gray-500 text-sm">
                  {new Date(post.post.dateCreated).toLocaleString()}
                </p>
                <p className="text-gray-800 font-medium">
                  <strong>Author:</strong>{" "}
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : "Loading..."}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserHomePage;
