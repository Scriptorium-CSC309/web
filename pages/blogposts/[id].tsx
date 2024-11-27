import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa';
import api from '@/frontend/utils/api';
import { StateContext as UserStateContext } from '@/frontend/contexts/UserContext';

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
  const [newComment, setNewComment] = useState<string>('');

  // Function to fetch user names for each comment
  const fetchCommentsWithUserNames = async (comments: Comment[]) => {
    const updatedComments = await Promise.all(
      comments.map(async (comment) => {
        if (comment.userId) {
          try {
            const userResponse = await api.get(`/user/profile/${comment.userId}`);
            return { ...comment, user: { name: userResponse.data.name } };
          } catch (error) {
            console.error(`Failed to fetch user for comment ID ${comment.id}:`, error);
            return comment; // Return the original comment if there's an error
          }
        }
        return comment;
      })
    );
    setComments(updatedComments);
  };

  // Function to fetch blog post data along with comments
  const fetchBlogPost = async () => {
    if (id) {
      try {
        console.log('Fetching blog post data for ID:', id);
        const res = await api.get(`/blogposts/${id}?t=${new Date().getTime()}`);
        const postData = res.data;
        console.log('Blog post data fetched:', postData);
        if (postData.userId) {
          const userRes = await api.get(`/user/profile/${postData.userId}`);
          setBlogPost({ ...postData, authorName: userRes.data.name });
        } else {
          setBlogPost(postData);
        }
        setComments(postData.comments || []);
        await fetchCommentsWithUserNames(postData.comments || []);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
      }
    }
  };

  useEffect(() => {
    fetchBlogPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!blogPost) {
    return <div>Loading...</div>;
  }

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (newComment.trim()) {
      try {
        console.log('Attempting to add comment:', newComment);
        const response = await api.post(`/comments`, {
          postId: blogPost.id,
          content: newComment,
        });
        console.log('Add comment response:', response);
        if (response.status === 201) {
          const userResponse = await api.get(`/user/profile/${user.id}`);
          const newCommentWithUser: Comment = { 
            ...response.data, 
            user: { name: userResponse.data.name } 
          };
          setComments((prevComments) => [...prevComments, newCommentWithUser]);
          setNewComment('');
          console.log('Comment added successfully');
        } else {
          console.error('Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  // Function to handle voting on the blog post
  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/blogposts/${blogPost.id}/vote`, { type });
      if (response.status === 200) {
        const { upvotes, downvotes } = response.data;
        setBlogPost((prevPost) =>
          prevPost ? { ...prevPost, upvotes, downvotes } : prevPost
        );
      } else {
        console.error('Failed to vote on blog post');
      }
    } catch (error) {
      console.error('Error voting on blog post:', error);
    }
  };

  // Function to handle voting on a comment
  const handleCommentVote = async (commentId: string, type: 'upvote' | 'downvote') => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/comments/${commentId}/vote`, { type });
      if (response.status === 200) {
        const { upvotes, downvotes } = response.data;
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, upvotes, downvotes } : comment
          )
        );
      } else {
        console.error('Failed to vote on comment');
      }
    } catch (error) {
      console.error('Error voting on comment:', error);
    }
  };

  // Function to handle reporting the blog post
  const handleReport = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/blogposts/${blogPost.id}/reports`, {
        explanation: 'This post is inappropriate.',
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

  // Function to handle reporting a comment
  const handleReportComment = async (commentId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const response = await api.post(`/comments/${commentId}/reports`, {
        explanation: 'This comment is inappropriate.',
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition duration-500">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Post Title */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{blogPost.title}</h1>
        
        {/* Blog Post Metadata */}
        <p className="text-gray-700 dark:text-gray-400 mb-4">
          By {blogPost.authorName} on {new Date(blogPost.postedAt).toLocaleDateString()}
        </p>
        
        {/* Blog Post Content */}
        <div className="mb-8">
          <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-300">{blogPost.content}</p>
        </div>

        {/* Voting and Reporting Buttons */}
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
                {/* Comment Content */}
                <p className="text-md mb-2 leading-relaxed text-gray-800 dark:text-gray-300">{comment.content}</p>
                
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
                      onClick={() => handleCommentVote(comment.id, 'upvote')}
                    >
                      <FaThumbsUp /> <span>({comment.upvotes})</span>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 transition duration-300 flex items-center space-x-1"
                      onClick={() => handleCommentVote(comment.id, 'downvote')}
                    >
                      <FaThumbsDown /> <span>({comment.downvotes})</span>
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-700 transition duration-300"
                      onClick={() => handleReportComment(comment.id)}
                    >
                      <FaFlag />
                    </button>
                  </div>
                </div>
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
