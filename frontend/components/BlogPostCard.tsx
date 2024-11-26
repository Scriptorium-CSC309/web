import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";

interface BlogPostCardProps {
    blogpost: {
        id: number;
        title: string;
        description: string;
        postedAt: string;
        upvotes: number;
        downvotes: number;
    };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({blogpost}) => {
    const router = useRouter();

    const handleBlogpostClick = (id: number) => {
      router.push(`/blogposts/${id}`);
    };
  return (
    
    <div onClick={() => handleBlogpostClick(blogpost.id)} className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer gap-4 mx-auto md:flex-row">
      <div className="flex flex-col justify-between md:w-3/4 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {blogpost.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {blogpost.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Posted on: {format(new Date(blogpost.postedAt), "MMMM d, yyyy")}
        </p>
      </div>
      <div className="flex flex-row md:flex-col justify-around items-center w-full md:w-1/4 p-4">
        <div className="flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400 font-bold">
            &#x1F44D; {blogpost.upvotes}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-600 dark:text-red-400 font-bold">
            &#x1F44E; {blogpost.downvotes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
