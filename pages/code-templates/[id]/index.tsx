import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import Avatar from "@/frontend/components/Avatar";
import { FaCodeBranch } from "react-icons/fa";
import api from "@/frontend/utils/api";
import { languageToMonacoLanguage } from "@/frontend/utils/language-to-monaco-language";
import { useTheme } from "next-themes";
import { useNotification } from "@/frontend/contexts/NotificationContext";
import { StateContext as UserStateContext } from "@/frontend/contexts/UserContext";

const CodeTemplatePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { theme } = useTheme();
    const { showNotification } = useNotification();
    const user = useContext(UserStateContext);
    console.log(user);

    const [templateData, setTemplateData] = useState<{
        title: string;
        description: string;
        tags: { name: string }[];
        code: string;
        language: string;
        user: {
            id: number;
            name: string;
            avatarId: number;
        };
    } | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            api.get(`/code-template/${id}`)
                .then(({ data }) => setTemplateData(data))
                .catch(() => setError("Failed to load template."))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleFork = async () => {
        if (!user) {
            showNotification(
                "You must be logged in to fork a template.",
                "error"
            );
            return;
        }

        try {
            // Step 1: Fetch the original template data
            const { data: templateData } = await api.get(
                `/code-template/${id}`
            );

            // Step 2: Create a new template with the fetched data
            const { data: newTemplate } = await api.post(`/code-template`, {
                title: `${templateData.title} (Forked)`, // Append "Forked" to the title for clarity
                description: templateData.description,
                tags: templateData.tags.map(
                    (tag: { name: string }) => tag.name
                ),
                code: templateData.code,
                language: templateData.language,
            });

            // Step 3: Redirect to /code with the new template ID and show a notification
            showNotification("Forked Successfully", "success", 10000);
            router.push(`/code?templateId=${newTemplate.id}`);
        } catch (err: any) {
            console.error("Failed to fork template:", err);
            showNotification(
                "An error occurred while forking the template. Please try again.",
                "error"
            );
        }
    };

    // Early returns for loading and error states
    if (isLoading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error || !templateData) {
        return (
            <div className="text-center mt-10 text-red-500">
                {error || "Template not found."}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 py-10 px-6">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-6">
                    <div className="flex items-center gap-4">
                        <Avatar
                            avatarId={templateData.user.avatarId}
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                                {templateData.title}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Created by {templateData.user.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleFork}
                        className={`flex items-center gap-2 px-5 py-2 rounded-md ${
                            user
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-600 text-white"
                        }`}
                    >
                        <FaCodeBranch />
                        <span>Fork</span>
                    </button>
                </div>

                {/* Tags */}
                <div className="p-6">
                    {templateData.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {templateData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full dark:bg-blue-900 dark:text-blue-200"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            No tags provided.
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Description
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {templateData.description || "No description provided."}
                    </p>
                </div>

                {/* Code */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Code
                    </h2>
                    <div className="mt-4 rounded-md overflow-hidden shadow-md">
                        <Editor
                            value={templateData.code}
                            language={
                                languageToMonacoLanguage[templateData.language]
                            }
                            theme={theme === "dark" ? "vs-dark" : "vs-light"}
                            options={{
                                readOnly: true,
                                padding: { top: 20 },
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                            }}
                            height="800px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeTemplatePage;
