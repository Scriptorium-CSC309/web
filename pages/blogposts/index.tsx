import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  postedAt: string;
  category: string;
}

const BlogPostsPage: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog posts from the API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch('/api/blogposts/');
        if (!res.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await res.json();
        console.log("Fetched Blog Posts:", data); // Inspect the structure here

        // Adjust based on the structure of the response
        if (Array.isArray(data.posts)) {
          setBlogPosts(data.posts);
          setFilteredPosts(data.posts);
        } else if (Array.isArray(data)) {
          setBlogPosts(data);
          setFilteredPosts(data);
        } else {
          console.error("Unexpected data format:", data);
          setBlogPosts([]);
          setFilteredPosts([]);
        }
      } catch (err: any) {
        console.error("Error fetching blog posts:", err.message);
        setBlogPosts([]);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Debounce search term to improve performance
  useEffect(() => {
    const handler = setTimeout(() => {
      filterPosts();
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, blogPosts]);

  // Function to filter posts based on search term and selected category
  const filterPosts = () => {
    if (!Array.isArray(blogPosts)) {
      console.error("blogPosts is not an array:", blogPosts);
      setFilteredPosts([]);
      return;
    }

    let filtered = blogPosts;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  // Memoize the filtered posts to prevent unnecessary re-renders
  const memoizedFilteredPosts = useMemo(() => filteredPosts, [filteredPosts]);

  const handleCreateNewPost = () => {
    router.push('/blogposts/create');
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 text-gray-800 dark:text-gray-100">
      <h1 className="text-5xl font-bold mb-10 text-center text-blue-600 dark:text-blue-400">
        Blog Posts
      </h1>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-2/3 lg:w-1/2 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Create New Blog Post Button */}
      <div className="flex justify-center mb-12">
        <button
          onClick={handleCreateNewPost}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          Create New Blog Post
        </button>
      </div>

      {/* Popular Categories */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
          Popular Categories
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {['Python', 'Java', 'Javascript', 'C', 'PHP'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              aria-pressed={selectedCategory === category}
              className={`bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-full shadow-sm transition-transform transform hover:scale-105 ${
                selectedCategory === category
                  ? 'ring-2 ring-offset-2 ring-blue-300'
                  : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Post List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            <p>Loading blog posts...</p>
          </div>
        ) : memoizedFilteredPosts.length > 0 ? (
          memoizedFilteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => router.push(`/blogposts/${post.id}`)}
            >
              <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">
                {post.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.description}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By {post.author} on{' '}
                  {new Date(post.postedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-500 dark:text-blue-400">
                  {post.category}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            <p>No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostsPage;
