// /pages/blogposts/create.tsx

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import withAuth from '@/frontend/utils/auth'; // Adjust the path as needed
import { getAccessToken } from '@/frontend/utils/token-storage';

const CreateBlogPostPage: React.FC = () => {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  // Tags state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Error and submission state
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success state
  const [success, setSuccess] = useState(false);

  // Handle adding a new tag
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields

    if (!title || !description || !content) {
      setError('All fields are required.');
      return;
    }

    // Retrieve the token from localStorage
    const token = getAccessToken();

    if (!token) {
      setError('You must be logged in to create a blog post.');
      // Optionally, redirect to the login page
      // router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/blogposts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include Bearer token
        },
        body: JSON.stringify({ title, description, content, category, tags }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create a new blog post.');
      }

      const data = await response.json();
      console.log('Blog post created:', data);

      // Set success state to true to display the success message
      setSuccess(true);

      // Optionally, clear the form fields after successful submission
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('');
      setTags([]);

      // Redirect to /blogposts after a short delay (e.g., 3 seconds)
      setTimeout(() => {
        router.push('/blogposts'); // Adjust the path as needed
      }, 1000); 
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key for tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 text-gray-800 dark:text-gray-100">
      <h1 className="text-5xl font-bold mb-10 text-center text-blue-600 dark:text-blue-400">
        Create a New Blog Post
      </h1>

      {/* Success Message */}
      {success && (
        <div className="max-w-3xl mx-auto mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Blog post created successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleCreatePost}
        className={`max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md ${success ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {error && (
          <div className="mb-4">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        )}

        {/* Title Field */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter the blog post title"
            required
          />
        </div>

        {/* Description Field */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={4}
            placeholder="Provide a short description of the blog post"
            required
          />
        </div>

        {/* Content Field */}
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={8}
            placeholder="Write your blog post content here"
            required
          />
        </div>

        {/* Tags Field */}
        <div className="mb-6">
          <label
            htmlFor="tags"
            className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
          >
            Tags
          </label>
          <div className="flex items-center">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Add a tag and press Enter or click Add"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-transform transform hover:scale-105"
            >
              Add
            </button>
          </div>
          {/* Display Added Tags */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700 dark:hover:text-red-300 focus:outline-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || success}
          className={`w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Creating...' : 'Create Blog Post'}
        </button>
      </form>
    </div>
  );
};

// Wrap the component with the withAuth HOC to enforce authentication
export default withAuth(CreateBlogPostPage, false); 