import { LANGUAGES } from "@/constants";
import api from "@/frontend/utils/api";
import React, { useState } from "react";
import { FaPlay } from "react-icons/fa"; // Play button icon

const CodeExecutionPage = () => {
    const [language, setLanguage] = useState("Python");
    const [code, setCode] = useState("");
    const [stdin, setStdin] = useState("");
    const [stdout, setStdout] = useState("");
    const [stderr, setStderr] = useState("");
    const [activeTab, setActiveTab] = useState<"stdout" | "stderr">("stdout");

    const handleRunCode = async () => {
        const response = await api.post("/execute", {
            language,
            code,
            stdin,
        });
        const data = await response.data;
        setStdout(data.stdout);
        setStderr(data.stderr);
    };

    return (
        <div className="min-h-full flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
            {/* Left Panel - Code Editor */}
            <div className="flex-1 p-4">
                <div className="relative bg-white dark:bg-gray-800 shadow-md rounded-md h-full border border-gray-300 dark:border-gray-700">
                    {/* Language Selector and Run Button */}
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            {LANGUAGES.map((languageName) => (
                                <option key={languageName} value={languageName}>
                                    {languageName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleRunCode}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            <FaPlay />
                        </button>
                    </div>
                    {/* Code Editor */}
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Write your code here..."
                        className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none rounded-md"
                    />
                </div>
            </div>

            {/* Right Panel - Stdin, Stdout, Stderr */}
            <div className="w-1/3 p-4 flex flex-col gap-4 min-h-full">
                {/* Stdin */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-300 dark:border-gray-700">
                    <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 font-semibold text-sm">
                        Stdin
                    </div>
                    <textarea
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                        placeholder="Enter stdin here..."
                        className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none rounded-b-md"
                    />
                </div>

                {/* Output - Stdout/StdErr with Tabs */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-300 dark:border-gray-700">
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
                        className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none rounded-b-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default CodeExecutionPage;
