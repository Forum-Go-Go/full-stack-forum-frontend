import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/slices/postSlice.js";
import { fetchUser } from "../../redux/slices/userSlice.js";

const UserHomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const users = useSelector((state) => state.user?.users || {});
  const userError = useSelector((state) => state.user?.error);

  const [sortByDate, setSortByDate] = useState(true);
  const [titleFilter, setTitleFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState(""); // New Creator Filter
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
    let sorted = [...posts];

    // Sorting by Date Created
    if (sortByDate !== null) {
      sorted = sorted.sort((a, b) =>
        sortByDate
          ? new Date(b.post.dateCreated) - new Date(a.post.dateCreated)
          : new Date(a.post.dateCreated) - new Date(b.post.dateCreated)
      );
    }

    setSortedPosts(sorted);
  }, [posts, sortByDate]);

  // Filtering Posts by Title & Creator
  const filteredPosts = sortedPosts.filter((post) => {
    const titleMatch = post.post.title
      .toLowerCase()
      .includes(titleFilter.toLowerCase());
    const creatorMatch = creatorFilter
      ? post.post.userId == creatorFilter
      : true;
    return titleMatch && creatorMatch;
  });

  // Unique Creators for Dropdown
  const uniqueCreators = [...new Set(posts.map((post) => post.post.userId))];

  return (
    <div className="flex flex-col items-center p-6 mt-16">
      <h1 className="text-2xl font-bold mb-4">Published Posts</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setSortByDate((prev) => !prev)}
        >
          Sort by Date{" "}
          {sortByDate ? (
            <i className="fa-regular fa-circle-up"></i>
          ) : (
            <i class="fa-regular fa-circle-down"></i>
          )}
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          onClick={() => {
            setTitleFilter("");
            setCreatorFilter("");
            setSortByDate(true);
          }}
        >
          Reset Filters
        </button>
      </div>

      <input
        type="text"
        placeholder="Filter by title..."
        className="border p-2 mb-4 w-full max-w-md"
        value={titleFilter}
        onChange={(e) => setTitleFilter(e.target.value)}
      />

      <select
        className="border p-2 mb-4 w-full max-w-md"
        value={creatorFilter}
        onChange={(e) => setCreatorFilter(e.target.value)}
      >
        <option value="">Filter by Creator</option>
        {uniqueCreators.map((userId) => (
          <option key={userId} value={userId}>
            {users[userId]?.firstName || "Unknown"}{" "}
            {users[userId]?.lastName || ""}
          </option>
        ))}
      </select>

      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mb-4"
        onClick={() => console.log("Open Create Post Modal")}
      >
        <i className="fa-solid fa-plus"></i> Create New Post
      </button>

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
              firstName: "Loading...",
              lastName: "",
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
                  <strong>Author:</strong> {user.firstName} {user.lastName}
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
