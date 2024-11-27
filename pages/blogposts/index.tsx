import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { SORT_BY_OPTIONS } from '@/constants';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  userId: string;
  postedAt: string;
  tags: { id: string; name: string }[];
  upvotes: number;
  downvotes: number;
}

interface Author {
  userId: string;
  name: string;
}

const BlogPostsPage: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [authorNames, setAuthorNames] = useState<{ [key: string]: string }>({});
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');

  // Fetch blog posts from the API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {

        const res = await fetch(`/api/blogposts?sortBy=${sortBy}`);
        if (!res.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await res.json();

        if (Array.isArray(data.posts)) {
          setBlogPosts(data.posts);
          setFilteredPosts(data.posts);
        } else if (Array.isArray(data)) {
          setBlogPosts(data);
          setFilteredPosts(data);
        } else {
          console.error('Unexpected data format:', data);
          setBlogPosts([]);
          setFilteredPosts([]);
        }
      } catch (err: any) {
        console.error('Error fetching blog posts:', err.message);
        setBlogPosts([]);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [sortBy]);

  // Fetch author names for each blog post
  useEffect(() => {
    const fetchAuthorNames = async () => {
      const uniqueAuthorIds = [...new Set(blogPosts.map((post) => post.id).filter((id) => !isNaN(Number(id))))];
      console.log('Unique Author IDs:', uniqueAuthorIds); // Log the IDs to check if they are correct

      const authorPromises = uniqueAuthorIds.map(async (userId) => {
        try {
          console.log(`Fetching author with ID: ${userId}`); // Log each ID before making the request

          // Use the correct API URL with the appropriate port
          const res = await fetch(`/api/user/profile/${userId}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch user with ID ${userId}`);
          }
          const { name } = await res.json();
          console.log(`Fetched user name: ${name} for ID: ${userId}`); // Log the response
          return { id: userId, name };
        } catch (err: any) {
          console.error('Error fetching author:', err.message);
          return { id: userId, name: 'Unknown Author' };
        }
      });

      const authors = await Promise.all(authorPromises);
      const authorMap = authors.reduce((map, author) => {
        map[author.id] = author.name;
        return map;
      }, {} as { [key: string]: string });

      console.log('Author map:', authorMap); // Log the final author map to verify
      setAuthorNames(authorMap);
    };

    if (blogPosts.length > 0) {
      fetchAuthorNames();
    }
  }, [blogPosts]);

  // Extract unique tags from blog posts
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    blogPosts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag.name));
    });
    return Array.from(tagsSet); // Convert Set to Array
  }, [blogPosts]);

  // Debounce search term to improve performance
  useEffect(() => {
    const handler = setTimeout(() => {
      filterPosts();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedTag, blogPosts]);

  const filterPosts = () => {
    if (!Array.isArray(blogPosts)) {
      console.error('blogPosts is not an array:', blogPosts);
      setFilteredPosts([]);
      return;
    }

    let filtered = blogPosts;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => tag.name === selectedTag)
      );
    }

    setFilteredPosts(filtered);
  };

  const memoizedFilteredPosts = useMemo(() => filteredPosts, [filteredPosts]);

  const handleCreateNewPost = () => {
    router.push('/blogposts/create');
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
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
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === SORT_BY_OPTIONS.valued) {
              setSortBy(SORT_BY_OPTIONS.valued);
            } else if (value === 'controversial') {
              setSortBy(SORT_BY_OPTIONS.controversial);
            } else {
              setSortBy('');
            }
            }}
            className="ml-4 w-1/20 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
          <option value="">Sort by...</option>
          <option value="valued">Sort by Valued</option>
          <option value="controversial">Sort by Controversial</option>
        </select>
      </div>

      {/* Tags */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
          Tags
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              aria-pressed={selectedTag === tag}
              className={`bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-full shadow-sm transition-transform transform hover:scale-105 ${
                selectedTag === tag ? 'ring-2 ring-offset-2 ring-blue-300' : ''
              }`}
            >
              {tag}
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
              <div className="absolute top-4 right-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    &#x1F44D; {post.upvotes}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    &#x1F44E; {post.downvotes}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.description}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By {authorNames[post.userId] || 'Unknown Author'} on{' '}
                  {new Date(post.postedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-500 dark:text-blue-400">
                </p>
              </div>
              {/* Display Tags */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tags:
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={tag.id || index}
                      className="px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
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
