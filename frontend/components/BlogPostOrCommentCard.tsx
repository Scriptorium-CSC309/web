import React, { useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import api from "../utils/api";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  postedAt: string;
  upvotes: number;
  downvotes: number;
  reportCount: number;
  isHidden: boolean;
}

interface Comment {
  id: number;
  content: string;
  postedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  upvotes: number;
  downvotes: number;
  reportCount: number;
  isHidden: boolean;
  postId: number;
}

interface ContentCardProps {
  blogpost?: BlogPost;
  comment?: Comment;
}


const BlogPostCard: React.FC<ContentCardProps> = ({ blogpost, comment }) => {
  const content = blogpost || comment;
  if (!content) {
    return null; // No content to display
  }
  const [isHidden, setIsHidden] = React.useState(content.isHidden);
  const router = useRouter();

  const handleBlogpostClick = (endpoint: string) => {
    router.push(endpoint);
  };

  const toggleHideBlogpost = async (event: React.MouseEvent, endpoint: string) => {
    event.stopPropagation()
    try {
      await api.patch(endpoint, { isHidden: !content.isHidden });
      content.isHidden = !content.isHidden;
      setIsHidden(!isHidden);
    } catch (err) {
      console.error("Failed to hide/unhide blog post", err);
    }
  };

  useEffect(() => {

  }, [isHidden]);

  const endpoint: string = blogpost ? `/blogposts/${blogpost.id}` : `/blogposts/${comment?.postId}`;
  return (
    <div
    
      onClick={() => handleBlogpostClick(endpoint)}
      
      className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer gap-4 mx-auto md:flex-row"
    >
      <div className="flex flex-col justify-between md:w-3/4 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {blogpost ? blogpost.title : `Comment by ${comment?.user.name}`}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {blogpost ? blogpost.description : comment?.content}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Posted on: {format(new Date(content.postedAt), "MMMM d, yyyy")}
        </p>
      </div>
      <div className="flex flex-row justify-around items-center w-full md:w-1/4 p-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400 font-bold">
            &#x1F44D; {content.upvotes}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-600 dark:text-red-400 font-bold">
            &#x1F44E; {content.downvotes}
          </span>
        </div>
        {
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Reports
              </h3>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {content.reportCount}
              </p>
            </div>
          </div>
        }
        <button
          onClick={(event) => toggleHideBlogpost(event, endpoint)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
        >
          {content.isHidden ? "Unhide" : "Hide"}
        </button>
      </div>
    </div>
  );
};

export default BlogPostCard;
