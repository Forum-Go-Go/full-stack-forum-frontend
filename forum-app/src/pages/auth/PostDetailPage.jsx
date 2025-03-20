import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUser } from "../../redux/slices/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const user = useSelector((state) => state.user?.users[post?.userId] || {});
  const [replies, setReplies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReply, setNewReply] = useState(""); // To handle new reply input
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5002/posts/${postId}`
        );
        const new_post = response.data.post;
        setPost(response.data.post);

        if (new_post && new_post?.userId) {
          dispatch(fetchUser(new_post?.userId))
            .unwrap()
            .catch((err) => console.error("Failed to fetch user:", err));
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Error fetching post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReplies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:5003/replies/post/${postId}`
        );
        let newReplies = response.data;
        console.log(response.data);

        if (!Array.isArray(newReplies)) {
          newReplies = []; // Default to an empty array if it's not an array
        }

        // Fetch user data for each reply and attach to reply object
        const enrichedReplies = await Promise.all(
          newReplies.map(async (reply) => {
            try {
              const userResponse = await axios.get(
                `http://127.0.0.1:5009/users/${reply.reply.userId}/profile`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              console.log("Reply response:", userResponse.data.reply);

              const userName = `${userResponse.data.user.firstName} ${userResponse.data.user.lastName}`;
              return {
                ...reply,
                userName, // or whatever field contains the name
              };
            } catch (userErr) {
              console.error(
                `Failed to fetch user for reply ${reply.id}:`,
                userErr
              );
              return { ...reply, userName: "Unknown User" };
            }
          })
        );

        setReplies(enrichedReplies);
      } catch (err) {
        console.error("Error fetching replies:", err);
        setError("Error fetching replies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    fetchReplies();
  }, [postId]);

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return; // Don't submit if reply is empty

    setReplyLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:5009/replies/post/${postId}`,
        {
          comment: newReply,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReplies((prevReplies) => {
        const currentReplies = Array.isArray(prevReplies) ? prevReplies : [];
        return [response.data.reply, ...currentReplies]; // Add the new reply to the front
      });
      setNewReply(""); // Reset reply input after successful submission
    } catch (err) {
      console.error("Error posting reply:", err);
      setError("Error posting reply. Please try again later.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;

    try {
      await axios.put(
        `http://127.0.0.1:5009/replies/delete/${replyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.reply.replyId !== replyId)
      );
    } catch (err) {
      console.error("Error deleting reply:", err);
      setError("Error deleting reply. Please try again later.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading post...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center mt-10">Post not found.</div>;

  //Check Post statuses
  const isPostUnpublished = post.status === "Unpublished";
  const isPostDeleted = post.status === "Deleted";
  const isPostHidden = post.status === "Hidden";
  const isPostBanned = post.status === "Banned";

  return (
    <div className="flex flex-col items-center mt-16 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">Title: {post.title}</h2>
        <p className="text-gray-500 text-sm mb-4">
          Author: {user.firstName + " " + user.lastName}
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Created on: {post.dateCreated}
        </p>
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Status:</span> {post.status}
        </p>
        <div className="prose max-w-none text-gray-800 mb-6">
          Content: {post.content}
        </div>
        {post.images && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Image</h3>
            <div className="flex justify-center">
              <img
                src={post.images}
                alt="Post image"
                className="rounded-lg shadow hover:scale-105 transition-transform duration-300 max-h-[400px] object-contain"
              />
            </div>
          </div>
        )}

        {/* Display replies */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Replies</h3>
          {replies && replies.length > 0 ? (
            <div>
              {replies.map((reply) => (
                <div key={reply.reply.replyId} className="border-b pb-4 mb-4">
                  <p className="font-semibold">Author: {reply.userName}</p>
                  <p className="font-semibold">Reply: {reply.reply.comment}</p>
                  <p className="text-gray-500 text-sm">
                    Posted on: {reply.reply.dateCreated}
                  </p>

                  {/* Show delete button if the logged-in user is the reply author */}
                  {JSON.parse(localStorage.getItem("user")).id ===
                    reply.reply.userId && (
                    <button
                      onClick={() => handleDeleteReply(reply.reply.replyId)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No replies yet. Be the first to reply!</p>
          )}
        </div>

        {/* Reply form */}
        {isPostDeleted ? (
          <p className="text-red-500">This post has been deleted.</p>
        ) : (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Add a Reply</h3>
            {isPostUnpublished ? (
              <p className="text-red-500">
                Replies are disabled for unpublished posts.
              </p>
            ) : (
              <form
                onSubmit={handleReplySubmit}
                className="flex flex-col space-y-4"
              >
                <textarea
                  value={newReply}
                  onChange={handleReplyChange}
                  placeholder="Write your reply..."
                  className="border rounded-md p-2 w-full"
                  rows="4"
                />
                <button
                  type="submit"
                  disabled={replyLoading || isPostUnpublished}
                  className={`px-6 py-2 bg-blue-500 text-white rounded-md ${
                    replyLoading || isPostUnpublished
                      ? "bg-gray-400"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {replyLoading ? "Posting Reply..." : "Post Reply"}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={() => navigate("/user-posts")}
          >
            Back to Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
