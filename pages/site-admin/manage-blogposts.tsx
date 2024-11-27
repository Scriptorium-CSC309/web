import React, { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Avatar from "@/frontend/components/Avatar";
import {
    StateContext as UserStateContext,
    DispatchContext as UserDispatchContext,
} from "@/frontend/contexts/UserContext";
import api from "@/frontend/utils/api";
import { NUM_AVATARS } from "@/constants";
import { HiOutlinePencil, HiOutlineSearch } from "react-icons/hi";
import withAuth from "@/frontend/utils/auth";
import InfoCard from "@/frontend/components/InfoCard";
import AdminPortalLayout from "@/frontend/components/AdminPortalLayout";
import BlogPostCard from "@/frontend/components/BlogPostOrCommentCard";
import { ITEMS_PER_PAGE } from "@/constants";

const ManageBlogPosts = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBlogPosts = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                pageSize: ITEMS_PER_PAGE,
                tags: tags.length > 0 ? tags.join() : undefined,
                search: searchQuery,
                sort: "desc",
            };
            const { data } = await api.get("/blogposts/admin-get-blogposts", { params });
            setBlogPosts(data.blogPosts);
            setTotalPages(Math.ceil(data.total / data.pageSize));
        } catch (err) {
            console.error("Failed to fetch blog posts", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBlogPosts();
    }, [searchQuery, tags, page]);

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags((prev) => [...prev, newTag.trim()]);
            setNewTag(""); // Clear the input field
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <AdminPortalLayout>
            {/* Search and Filtering Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-2xl font-semibold text-center mb-10 dark:text-white">Manage Blog Posts</h3>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg w-full md:w-1/2 mx-auto mb-4">
                    <HiOutlineSearch className="text-gray-400 ml-2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search blog posts..."
                        className="w-full p-2 text-sm bg-transparent focus:outline-none ml-2 text-gray-700 dark:text-gray-300"
                    />
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    {tags.map((tag) => (
                        <span key={tag} className="bg-blue-100 text-blue-700 text-xs font-medium rounded-full px-3 py-1 cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                            {tag} &times;
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-center mt-4">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="p-2 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                        onClick={handleAddTag}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Tag
                    </button>
                </div>
            </div>

            {/* Blog Posts Section */}
            <div className="mt-8">
                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Loading blog posts...</p>
                ) : blogPosts.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">No blog posts found.</p>
                ) : (
                    <div>
                        {blogPosts
                            .map((post: any) => <BlogPostCard key={post.id} blogpost={post} />)
                        }
                    </div>
                )}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </AdminPortalLayout>
    );
};

export default withAuth(ManageBlogPosts, true);
