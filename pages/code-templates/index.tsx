import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Avatar from "@/frontend/components/Avatar";
import api from "@/frontend/utils/api";
import { FaSearch, FaUser } from "react-icons/fa";
import LanguageIcon from "@/frontend/components/LanguageIcon";
import { StateContext as UserStateContext } from "@/frontend/contexts/UserContext";
import LoadingScreen from "@/frontend/components/LoadingScreen";

const CodeTemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showMyTemplates, setShowMyTemplates] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const userContext = useContext(UserStateContext);

    const router = useRouter();

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                title: searchQuery,
                description: searchQuery,
                tags: [],
                userId:
                    showMyTemplates && userContext ? userContext.id : undefined,
            };
            const { data } = await api.get("/code-template", { params });
            setTemplates(data.codeTemplates);
            setTotalPages(Math.ceil(data.total / data.pageSize));
        } catch (err) {
            console.error("Failed to fetch templates", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [searchQuery, showMyTemplates, page]);

    const handleTemplateClick = (id: number) => {
        router.push(`/code-templates/${id}`);
    };

    return (
        <div className="min-h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 py-6 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Search and Filter Section */}
                <div className="flex flex-col items-center mb-8 space-y-4">
                    <div className="relative w-full max-w-3xl">
                        <input
                            type="text"
                            placeholder="Search by title, description, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        />
                        <FaSearch className="absolute top-3 right-3 text-gray-500" />
                    </div>
                    {userContext && (
                        <button
                            onClick={() => setShowMyTemplates((prev) => !prev)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                                showMyTemplates
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                            }`}
                        >
                            <FaUser />
                            {showMyTemplates ? "My Templates" : "All Templates"}
                        </button>
                    )}
                </div>

                {/* Templates List */}
                <div className="space-y-4">
                    {loading ? (
                        <LoadingScreen />
                    ) : templates.length === 0 ? (
                        <div className="text-center text-gray-500">
                            No templates found.
                        </div>
                    ) : (
                        templates.map((template: any) => (
                            <div
                                key={template.id}
                                className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer gap-4  mx-auto md:flex-row"
                                onClick={() => handleTemplateClick(template.id)}
                            >
                                {/* Left: Avatar and User Info */}
                                <div className="flex items-center gap-4 md:w-1/4 md:flex-col md:items-start">
                                    <Avatar
                                        avatarId={template.user.avatarId}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center md:text-left">
                                        {template.user.name}
                                    </h3>
                                </div>

                                {/* Center: Description and Title */}
                                <div className="flex flex-col flex-grow md:w-2/4 text-center md:text-left">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {template.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        {template.description ||
                                            "No description provided."}
                                    </p>
                                </div>

                                {/* Right: Tags and Language */}
                                <div className="flex flex-col items-center gap-2 md:w-1/4 md:items-end mt-4 md:mt-0">
                                    <div className="flex items-center gap-2">
                                        <LanguageIcon
                                            language={template.language}
                                        />
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {template.language}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-end">
                                        {template.tags.map(
                                            (
                                                tag: { name: string },
                                                index: number
                                            ) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200"
                                                >
                                                    {tag.name}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeTemplatesPage;


