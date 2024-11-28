import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { FaThumbsUp, FaThumbsDown, FaFlag, FaPlus } from "react-icons/fa";
import api from "@/frontend/utils/api";
import { StateContext as UserStateContext } from "@/frontend/contexts/UserContext";
import { useNotification } from "@/frontend/contexts/NotificationContext";
import LoadingScreen from "@/frontend/components/LoadingScreen";
import { SORT_BY_OPTIONS } from "@/constants";

// Define types for BlogPost and Comment
interface BlogPost {
    id: string;
    title: string;
    userId: number;
    authorName?: string;
    postedAt: string;
    content: string;
    upvotes: number;
    downvotes: number;
    comments?: Comment[];
}

interface Comment {
    id: string;
    content: string;
    userId: number;
    upvotes: number;
    downvotes: number;
    user?: {
        name: string;
    };
    replies?: Comment[];
}

const BlogPostPage = () => {
    const router = useRouter();
    const user = useContext(UserStateContext);
    const { id } = router.query as { id: string }; // Get the `id` from the URL, assume it's a string

    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { showNotification } = useNotification();
    const [sortBy, setSortBy] = useState<string>("");

    // Report Modal States
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportType, setReportType] = useState<"post" | "comment" | null>(
        null
    );
    const [reportCommentId, setReportCommentId] = useState<string | null>(null);
    const [reportExplanation, setReportExplanation] = useState<string>("");

    // Function to fetch user names for each comment
    const fetchCommentsWithUserNames = async (comments: Comment[]) => {
        const updatedComments = await Promise.all(
            comments.map(async (comment) => {
                if (comment.userId) {
                    try {
                        const userResponse = await api.get(
                            `/user/profile/${comment.userId}`
                        );
                        return {
                            ...comment,
                            user: { name: userResponse.data.name },
                        };
                    } catch (error) {
                        console.error(
                            `Failed to fetch user for comment ID ${comment.id}:`,
                            error
                        );
                        return comment; // Return the original comment if there's an error
                    }
                }
                return comment;
            })
        );
        setComments(updatedComments);
    };

    const fetchSortedComments = async () => {
        try {
          const { data } = await api.get(`/comments?postId=${id}&sortBy=${sortBy}`);
          const sortedComments = data.comments;
          console.log('Sorted comments:', sortedComments);
          setComments(sortedComments);
        } catch (error) {
          console.error('Failed to fetch sorted comments:', error);
        }
      }


    // Function to fetch blog post data along with comments
    const fetchBlogPost = async () => {
        if (id) {
            try {
                console.log("Fetching blog post data for ID:", id);
                const res = await api.get(
                    `/blogposts/${id}?t=${new Date().getTime()}`
                );
                const postData = res.data;
                console.log("Blog post data fetched:", postData);
                if (postData.userId) {
                    const userRes = await api.get(
                        `/user/profile/${postData.userId}`
                    );
                    setBlogPost({ ...postData, authorName: userRes.data.name });
                } else {
                    setBlogPost(postData);
                }
                setComments(postData.comments || []);
                await fetchCommentsWithUserNames(postData.comments || []);
            } catch (err: any) {
                if (err.status == 404) {
                    showNotification("Blogpost does not exist", "error");
                    router.push("/blogposts");
                }
                console.error("Failed to fetch blog post:", err);
            }
        }
    };

    useEffect(() => {
        fetchBlogPost();
    }, [id]);

    useEffect(() => {
        fetchSortedComments();
    }, [sortBy, comments]);
    if (!blogPost) {
        return <LoadingScreen />;
    }

    // Function to handle adding a new comment
    const handleAddComment = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        if (newComment.trim()) {
            try {
                console.log("Attempting to add comment:", newComment);
                const response = await api.post(`/comments`, {
                    postId: blogPost.id,
                    content: newComment,
                });
                console.log("Add comment response:", response);
                if (response.status === 201) {
                    const userResponse = await api.get(
                        `/user/profile/${user.id}`
                    );
                    const newCommentWithUser: Comment = {
                        ...response.data,
                        user: { name: userResponse.data.name },
                    };
                    setComments((prevComments) => [
                        ...prevComments,
                        newCommentWithUser,
                    ]);
                    setNewComment("");
                    console.log("Comment added successfully");
                } else {
                    console.error("Failed to add comment");
                }
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    // Function to handle voting on the blog post
    const handleVote = async (type: "upvote" | "downvote") => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        try {
            const response = await api.post(`/blogposts/${blogPost.id}/vote`, {
                type,
            });
            if (response.status === 200) {
                const { upvotes, downvotes } = response.data;
                setBlogPost((prevPost) =>
                    prevPost ? { ...prevPost, upvotes, downvotes } : prevPost
                );
            } else {
                console.error("Failed to vote on blog post");
            }
        } catch (error) {
            console.error("Error voting on blog post:", error);
        }
    };

    // Function to handle voting on a comment
    const handleCommentVote = async (
        commentId: string,
        type: "upvote" | "downvote"
    ) => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        try {
            const response = await api.post(`/comments/${commentId}/vote`, {
                type,
            });
            if (response.status === 200) {
                const { upvotes, downvotes } = response.data;
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, upvotes, downvotes }
                            : comment
                    )
                );
            } else {
                console.error("Failed to vote on comment");
            }
        } catch (error) {
            console.error("Error voting on comment:", error);
        }
    };

    // Function to open the report modal
    const handleOpenReportModal = (
        type: "post" | "comment",
        commentId?: string
    ) => {
        setReportType(type);
        setReportCommentId(commentId || null);
        setReportExplanation("");
        setShowReportModal(true);
    };

    // Function to close the report modal
    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setReportType(null);
        setReportCommentId(null);
        setReportExplanation("");
    };

    // Function to submit the report
    const handleSubmitReport = async () => {
        if (!reportExplanation.trim()) {
            showNotification(
                "Please provide an explanation for the report.",
                "error"
            );
            return;
        }

        try {
            if (reportType === "post" && blogPost) {
                const response = await api.post(
                    `/blogposts/${blogPost.id}/reports`,
                    {
                        explanation: reportExplanation,
                    }
                );
                if (response.status === 200) {
                    showNotification(
                        "Report submitted successfully. Thank you for your feedback.",
                        "success"
                    );
                } else {
                    showNotification(
                        "Failed to report the post. Please try again later.",
                        "error"
                    );
                }
            } else if (reportType === "comment" && reportCommentId) {
                const response = await api.post(
                    `/comments/${reportCommentId}/reports`,
                    {
                        explanation: reportExplanation,
                    }
                );
                if (response.status === 200) {
                    showNotification(
                        "Comment report submitted successfully. Thank you for your feedback.",
                        "success"
                    );
                } else {
                    showNotification(
                        "Failed to report the comment. Please try again later.",
                        "error"
                    );
                    console.log(response);
                }
            }
            handleCloseReportModal();
        } catch (err: any) {
            showNotification(
                err?.response?.data?.error ||
                    `Failed to report the ${reportType}. Please try again later.`,
                "error"
            );
            console.error(`Error reporting ${reportType}:`, err);
        }
    };

    // Function to handle reporting the blog post
    const handleReport = () => {
        handleOpenReportModal("post");
    };

    // Function to handle reporting a comment
    const handleReportComment = (commentId: string) => {
        handleOpenReportModal("comment", commentId);
    };

    // Function to handle blog post deletion
    const handleDeleteBlogPost = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        try {
            const response = await api.delete(`/blogposts/${blogPost.id}`);
            if (response.status === 200) {
                showNotification("Blog post deleted successfully.", "success");
                router.push("/blogposts");
            } else {
                showNotification(
                    "Failed to delete the blog post. Please try again later.",
                    "error"
                );
            }
        } catch (error) {
            console.error("Error deleting blog post:", error);
            showNotification(
                "An error occurred while deleting the blog post. Please try again later.",
                "error"
            );
        }
    };

    return (
        <div className="min-h-full bg-white dark:bg-gray-900 dark:text-white transition duration-500">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Blog Post Title */}
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {blogPost.title}
                </h1>

                {/* Blog Post Metadata */}
                <p className="text-gray-700 dark:text-gray-400 mb-4">
                    By {blogPost.authorName} on{" "}
                    {new Date(blogPost.postedAt).toLocaleDateString()}
                </p>

                {/* Blog Post Content */}
                <div className="mb-8">
                    <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                        {blogPost.content}
                    </p>
                </div>

                {/* Voting and Reporting Buttons */}
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-lg transition duration-300"
                        onClick={() => handleVote("upvote")}
                    >
                        <FaThumbsUp />
                        <span> {blogPost.upvotes}</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow-lg transition duration-300"
                        onClick={() => handleVote("downvote")}
                    >
                        <FaThumbsDown />
                        <span>{blogPost.downvotes}</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded shadow-lg transition duration-300"
                        onClick={handleReport}
                    >
                        <FaFlag />
                        <span>Report</span>
                    </button>
                    {/* Show Delete Button if the user is the creator */}
                    {user && user.id === blogPost.userId && (
                        <button
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded shadow-lg transition duration-300"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Delete
                        </button>
                    )}
                </div>

                {/* Add Comment Section */}
                <div className="mb-8">
          <textarea
            className="w-full p-4 rounded-md border border-gray-300 dark:border-gray-700 mb-4 dark:bg-gray-800 dark:text-white"
            rows={4}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-lg"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
          <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === SORT_BY_OPTIONS.valued) {
              setSortBy(SORT_BY_OPTIONS.valued);
            } else if (value === "controversial") {
              setSortBy(SORT_BY_OPTIONS.controversial);
            } else {
              setSortBy("");
            }
          }}
          className="ml-4 w-1/20 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Sort by Time</option>
          <option value="valued">Sort by Valued</option>
          <option value="controversial">Sort by Controversial</option>
        </select>
        </div>

                {/* Comments Section */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md transition duration-300">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Comments
                    </h2>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="border-b border-gray-300 dark:border-gray-700 py-4"
                            >
                                {/* Comment Content */}
                                <p className="text-md mb-2 leading-relaxed text-gray-800 dark:text-gray-300">
                                    {comment.content}
                                </p>

                                {/* Comment Author */}
                                {comment.user && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        By {comment.user.name}
                                    </p>
                                )}

                                {/* Comment Actions */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="text-green-600 hover:text-green-700 transition duration-300 flex items-center space-x-1"
                                            onClick={() =>
                                                handleCommentVote(
                                                    comment.id,
                                                    "upvote"
                                                )
                                            }
                                        >
                                            <FaThumbsUp />{" "}
                                            <span>{comment.upvotes}</span>
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-700 transition duration-300 flex items-center space-x-1"
                                            onClick={() =>
                                                handleCommentVote(
                                                    comment.id,
                                                    "downvote"
                                                )
                                            }
                                        >
                                            <FaThumbsDown />{" "}
                                            <span>{comment.downvotes}</span>
                                        </button>
                                        <button
                                            className="text-yellow-600 hover:text-yellow-700 transition duration-300"
                                            onClick={() =>
                                                handleReportComment(comment.id)
                                            }
                                        >
                                            <FaFlag />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                            No comments yet.
                        </p>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4">
                            Confirm Delete
                        </h2>
                        <p className="mb-4">
                            Are you sure you want to delete this blog post? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                                onClick={handleDeleteBlogPost}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">
                            Report {reportType === "post" ? "Post" : "Comment"}
                        </h2>
                        <textarea
                            className="w-full p-4 rounded-md border border-gray-300 dark:border-gray-700 mb-4 dark:bg-gray-800 dark:text-white"
                            rows={4}
                            placeholder="Please provide an explanation for your report..."
                            value={reportExplanation}
                            onChange={(e) =>
                                setReportExplanation(e.target.value)
                            }
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                                onClick={handleCloseReportModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                onClick={handleSubmitReport}
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPostPage;
