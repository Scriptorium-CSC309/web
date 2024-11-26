import { useRouter } from "next/router";
import { FaPlay, FaSave } from "react-icons/fa";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import Notification from "@/frontend/components/Notification";
import SaveTemplateModal from "@/frontend/components/SaveTemplateModal";
import api from "@/frontend/utils/api";
import { useEffect, useState } from "react";
import { languageToMonacoLanguage } from "@/frontend/utils/language-to-monaco-language";

const CodeExecutionPage = () => {
    const router = useRouter();
    const { templateId } = router.query; // Extract templateId from query
    const isEditing = !!templateId;

    const [language, setLanguage] = useState("Python");
    const [code, setCode] = useState("");
    const [stdin, setStdin] = useState("");
    const [stdout, setStdout] = useState("");
    const [stderr, setStderr] = useState("");
    const [activeTab, setActiveTab] = useState<"stdout" | "stderr">("stdout");
    const [notificationDetail, setNotificationDetail] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const [templateFields, setTemplateFields] = useState<{
        title: string;
        description: string;
        tags: string[];
    } | null>(null);

    const { theme } = useTheme();

    // Check user authorization for editing
    useEffect(() => {
        if (isEditing) {
            api.patch(`/code-template/${templateId}`, {})
                .then(() => {
                    // User is authorized; fetch template details
                    return api.get(`/code-template/${templateId}`);
                })
                .then(({ data }) => {
                    setTemplateFields({
                        title: data.title,
                        description: data.description,
                        tags: data.tags.map(
                            (tag: { name: string }) => tag.name
                        ),
                    });
                    setCode(data.code);
                    setLanguage(data.language);
                })
                .catch((err) => {
                    if (err.response?.status === 401) {
                        // Redirect to view-only page if unauthorized
                        router.replace(`/code-templates/${templateId}`);
                    } else {
                        setNotificationDetail({
                            message:
                                "Failed to load template: " +
                                (err.response?.data?.error || "Unknown error"),
                            type: "error",
                        });
                    }
                });
        }
    }, [templateId, isEditing]);

    const handleRunCode = async () => {
        try {
            const response = await api.post("/execute", {
                language,
                code,
                stdin,
            });
            const data = await response.data;
            setStdout(data.stdout);
            setStderr(data.stderr);
        } catch (err) {
            setNotificationDetail({
                message: "Failed to execute the code.",
                type: "error",
            });
        }
    };

    const handleSaveTemplate = () => {
        setShowSaveModal(true);
    };

    const handleSaveTemplateModal = async ({
        title,
        description,
        tags,
    }: {
        title: string;
        description: string;
        tags: string[];
    }) => {
        try {
            if (isEditing) {
                // Update existing template
                await api.patch(`/code-template/${templateId}`, {
                    title,
                    description,
                    tags,
                    code,
                    language,
                });
                setNotificationDetail({
                    message: "Template updated successfully.",
                    type: "success",
                });
            } else {
                // Create new template
                const response = await api.post("/code-template", {
                    title,
                    description,
                    tags,
                    code,
                    language,
                });
                setNotificationDetail({
                    message: "Template created successfully.",
                    type: "success",
                });

                // Redirect to /code?templateId={id}
                router.push(`/code?templateId=${response.data.id}`);
            }

            setShowSaveModal(false);
        } catch (err: any) {
            setNotificationDetail({
                message: `Failed to save template: ${
                    err.response?.data?.error || "Unknown error"
                }`,
                type: "error",
            });
        }
    };

    return (
        <div className="min-h-full flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
            {/* Show Notification */}
            {notificationDetail && (
                <Notification
                    message={notificationDetail.message}
                    duration={4000}
                    type={notificationDetail.type}
                    onClose={() => setNotificationDetail(null)}
                />
            )}

            {/* Show Save Template Modal */}
            {showSaveModal && (
                <SaveTemplateModal
                    onClose={() => setShowSaveModal(false)}
                    onSave={handleSaveTemplateModal}
                    initialTemplateFields={templateFields || undefined}
                    isEditing={isEditing}
                />
            )}

            {/* Left Panel - Monaco Editor */}
            <div className="w-full md:flex-1 p-4">
                <div className="relative bg-white dark:bg-gray-800 shadow-md rounded-lg h-[60vh] md:h-full border border-gray-300 dark:border-gray-700">
                    {/* Header with Language Selector, Play, and Save Buttons */}
                    <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
                        {/* Language Selector */}
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            {Object.keys(languageToMonacoLanguage).map(
                                (lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                )
                            )}
                        </select>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveTemplate}
                            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none shadow-lg"
                        >
                            <FaSave />
                        </button>

                        {/* Play Button */}
                        <button
                            onClick={handleRunCode}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none shadow-lg"
                        >
                            <FaPlay />
                        </button>
                    </div>

                    {/* Monaco Editor */}
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        language={languageToMonacoLanguage[language]}
                        value={code}
                        onChange={(newValue) => setCode(newValue || "")}
                        theme={theme === "dark" ? "vs-dark" : "vs-light"}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineHeight: 20,
                            padding: { top: 48 },
                            scrollbar: { vertical: "hidden" },
                            scrollBeyondLastLine: false,
                            overviewRulerBorder: false,
                        }}
                    />
                </div>
            </div>

            {/* Right Panel - Stdin, Stdout, Stderr */}
            <div className="w-full md:w-1/3 p-4 flex flex-col gap-4">
                {/* Stdin */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-300 dark:border-gray-700">
                    <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 font-semibold text-sm rounded-t-lg">
                        Stdin
                    </div>
                    <textarea
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                        placeholder="Enter stdin here..."
                        className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none rounded-b-lg"
                    />
                </div>

                {/* Output - Stdout/StdErr with Tabs */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-300 dark:border-gray-700">
                    {/* Tabs */}
                    <div className="flex border-b dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab("stdout")}
                            className={`flex-1 px-4 py-2 text-sm font-semibold text-center ${
                                activeTab === "stdout"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600"
                            }`}
                        >
                            Stdout
                        </button>
                        <button
                            onClick={() => setActiveTab("stderr")}
                            className={`flex-1 px-4 py-2 text-sm font-semibold text-center ${
                                activeTab === "stderr"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600"
                            }`}
                        >
                            Stderr
                        </button>
                    </div>
                    {/* Tab Content */}
                    <textarea
                        value={activeTab === "stdout" ? stdout : stderr}
                        readOnly
                        className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none rounded-b-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default CodeExecutionPage;
