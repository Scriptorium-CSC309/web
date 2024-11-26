import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa';
import api from '@/frontend/utils/api';
import { StateContext as UserStateContext } from '@/frontend/contexts/UserContext';

// Define types for BlogPost and Comment
interface BlogPost {
  id: string;
  title: string;
  authorId: number;
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
  user: {
    name: string;
  };
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
}

const BlogPostPage = () => {
  const router = useRouter();
  const user = useContext(UserStateContext);
  const { id } = router.query as { id: string }; // Get the `id` from the URL, assume it's a string

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  useEffect(() => {
    if (id) {
      // Fetch the blog post data by id
      api.get(`/blogposts/${id}?t=${new Date().getTime()}`)
        .then((res) => {
          const postData = res.data;
          if (postData.authorId) {
            api.get(`/users/${postData.authorId}`).then((userRes) => {
              setBlogPost({ ...postData, authorName: userRes.data.name });
              setComments(postData.comments || []);
            }).catch((err) => {
              console.error('Failed to fetch user:', err);
              setBlogPost(postData);
              setComments(postData.comments || []);
            });
          } else {
            setBlogPost(postData);
            setComments(postData.comments || []);
          }
        })
        .catch((err) => console.error('Failed to fetch blog post:', err));
    }
  }, [id]);

  if (!blogPost) {
    return <div>Loading...</div>;
  }

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/blogposts/${blogPost.id}/vote`, { type });
      if (response.status === 200) {
        setBlogPost((prevPost) =>
          prevPost ? { ...prevPost, upvotes: response.data.upvotes, downvotes: response.data.downvotes } : prevPost
        );
      } else {
        console.error('Failed to vote on blog post');
      }
    } catch (error) {
      console.error('Error voting on blog post:', error);
    }
  };

  const handleCommentVote = async (commentId: string, type: 'upvote' | 'downvote') => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/comments/${commentId}/vote`, { type });
      if (response.status === 200) {
        const updatedComment = response.data;
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
          )
        );
      } else {
        console.error('Failed to vote on comment');
      }
    } catch (error) {
      console.error('Error voting on comment:', error);
    }
  };

  const handleReport = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/blogposts/${blogPost.id}/reports`, {
        explanation: 'This post is inappropriate.'
      });
      if (response.status === 200) {
        alert('Report submitted successfully. Thank you for your feedback.');
      } else {
        alert('Failed to report the post. Please try again later.');
        console.error('Failed to report blog post');
      }
    } catch (error) {
      alert('An error occurred while reporting the post. Please try again later.');
      console.error('Error reporting blog post:', error);
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/comments/${commentId}/reports`, {
        explanation: 'This comment is inappropriate.'
      });
      if (response.status === 200) {
        alert('Comment report submitted successfully. Thank you for your feedback.');
      } else {
        alert('Failed to report the comment. Please try again later.');
        console.error('Failed to report comment');
      }
    } catch (error) {
      alert('An error occurred while reporting the comment. Please try again later.');
      console.error('Error reporting comment:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (newComment.trim()) {
      try {
        const response = await api.post(`/blogposts/${blogPost.id}/comments`, {
          content: newComment,
        });
        if (response.status === 201) {
          setComments([...comments, response.data]);
          setNewComment('');
        } else {
          console.error('Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleReplyToComment = (commentId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setReplyCommentId(commentId);
  };

  const handleAddReply = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (replyContent.trim() && replyCommentId) {
      try {
        const response = await api.post(`/comments/${replyCommentId}/replies`, {
          content: replyContent,
        });
        if (response.status === 201) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === replyCommentId
                ? { ...comment, replies: [...(comment.replies || []), response.data] }
                : comment
            )
          );
          setReplyContent('');
          setReplyCommentId(null);
        } else {
          console.error('Failed to add reply');
        }
      } catch (error) {
        console.error('Error adding reply:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition duration-500">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{blogPost.title}</h1>
        <p className="text-gray-700 dark:text-gray-400 mb-4">
          By {blogPost.authorName} on {new Date(blogPost.postedAt).toLocaleDateString()}
        </p>
        <div className="mb-8">
          <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-300">{blogPost.content}</p>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <button
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-lg transition duration-300"
            onClick={() => handleVote('upvote')}
          >
            <FaThumbsUp />
            <span>Upvote ({blogPost.upvotes})</span>
          </button>
          <button
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow-lg transition duration-300"
            onClick={() => handleVote('downvote')}
          >
            <FaThumbsDown />
            <span>Downvote ({blogPost.downvotes})</span>
          </button>
          <button
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded shadow-lg transition duration-300"
            onClick={handleReport}
          >
            <FaFlag />
            <span>Report</span>
          </button>
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
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md transition duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-300 dark:border-gray-700 py-4">
                <p className="text-md mb-2 leading-relaxed text-gray-800 dark:text-gray-300">{comment.content}</p>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">By {comment.user.name}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-green-600 hover:text-green-700 transition duration-300"
                      onClick={() => handleCommentVote(comment.id, 'upvote')}
                    >
                      <FaThumbsUp /> ({comment.upvotes})
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 transition duration-300"
                      onClick={() => handleCommentVote(comment.id, 'downvote')}
                    >
                      <FaThumbsDown /> ({comment.downvotes})
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-700 transition duration-300"
                      onClick={() => handleReportComment(comment.id)}
                    >
                      <FaFlag />
                    </button>
                  </div>
                </div>
                {/* Reply Section */}
                <button
                  className="text-blue-600 hover:underline mt-2"
                  onClick={() => handleReplyToComment(comment.id)}
                >
                  Reply
                </button>
                {replyCommentId === comment.id && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-4 rounded-md border border-gray-300 dark:border-gray-700 mb-2 dark:bg-gray-800 dark:text-white"
                      rows={2}
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-lg"
                      onClick={handleAddReply}
                    >
                      Add Reply
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
