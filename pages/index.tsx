import React from "react";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CollaborationSVG from "@/frontend/assets/images/collaboration.svg";
import CodeTemplateSVG from "@/frontend/assets/images/code-template-icon.svg";
import InstantExecutionSVG from "@/frontend/assets/images/play-hexagon.svg";

const LandingPage: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white min-h-screen flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                        Accelerate your prototyping
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Build. Debug. Collaborate. All in one powerful platform.
                    </p>
                    <div className="space-x-4">
                        <Link
                            href="/code"
                            className="px-8 py-4 bg-orange-500 text-white font-bold text-lg rounded-md shadow-md hover:bg-orange-600"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-8 py-4 bg-white text-blue-500 font-bold text-lg rounded-md shadow-md hover:bg-gray-200"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900 dark:text-gray-200">
                        Powerful Features to Supercharge Your Workflow
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-6 flex items-center justify-center w-16 h-16">
                                <img
                                    src={InstantExecutionSVG.src}
                                    alt="Instant Code Execution"
                                    className="w-16 h-16"
                                />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
                                Instant Code Execution
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Run your code in real-time with our isolated
                                execution engine. No setup required. Just write,
                                execute, and debug.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-6 flex items-center justify-center w-16 h-16">
                                <img
                                    src={CodeTemplateSVG.src}
                                    alt="Pre-Built Code Templates"
                                    className="w-16 h-16"
                                />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
                                Pre-Built Code Templates
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Save time with reusable, high-quality code
                                templates. Focus on building instead of
                                rewriting the basics.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-6 flex items-center justify-center w-16 h-16">
                                <img
                                    src={CollaborationSVG.src}
                                    alt="Collaborative Community"
                                    className="w-16 h-16"
                                />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
                                Collaborative Community
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Work with like-minded developers. Share
                                knowledge, learn, and grow with a vibrant coding
                                community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-t from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-200 mb-12">
                        Prototype with ease.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Side: Code Editor Mockup */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="bg-gray-900 p-4 rounded-md mb-4">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={darcula}
                                    customStyle={{
                                        background: "transparent",
                                        fontSize: "0.875rem",
                                        padding: "0",
                                    }}
                                >
                                    {`function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("Scriptorium"));`}
                                </SyntaxHighlighter>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-bold">
                                        $ node script.js
                                    </span>
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Hello, Scriptorium!
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Description */}
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-6">
                                Real-Time Debugging
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                Run and debug your code with ease, providing
                                input via stdin if needed. Scriptorium lets you
                                execute code instantly, spot issues, and fix
                                them with ease.
                            </p>
                            <Link
                                href="/code"
                                className="px-8 py-4 bg-blue-500 text-white font-bold text-lg rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                            >
                                Start Coding Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
