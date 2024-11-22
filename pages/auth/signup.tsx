import React, { useState } from "react";
import ScriptoriumLogo from "@/frontend/components/ScriptoriumLogo";
import api from "@/frontend/utils/api";
import Notification from "@/frontend/components/Notification"; // Import the Notification component
import { useRouter } from "next/router";

const SignupPage = () => {
    const router = useRouter();

    // State for form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
    });

    const [loading, setLoading] = useState(false); // State for loading
    const [error, setError] = useState(""); // State for error handling
    const [showSuccess, setShowSuccess] = useState(false); // State to show success notification

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Send POST request to /auth/signup
            const response = await api.post("/auth/signup", formData);
            if (response.status === 201) {
                setShowSuccess(true); // Show success notification
                setTimeout(() => {
                    router.push("/auth/login"); // Redirect to login after notification
                }, 1000);
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error ||
                "Something went wrong. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-full px-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Show Notification */}
            {showSuccess && (
                <Notification
                    message="Signup successful! Redirecting to login..."
                    type="success"
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 pt-4 w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <ScriptoriumLogo />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-center mb-2">
                    Welcome to{" "}
                    <span className="text-brand-blue">Scriptorium</span>
                </h2>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Hey there! To sign up, enter in your details below and we'll
                    get you started right up.
                </p>

                {/* Form */}
                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Name */}
                        <div>
                            <label
                                className="block text-sm mb-1"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-orange-500 text-sm"
                                placeholder="Full name"
                                aria-label="Name"
                                required
                            />
                        </div>
                        {/* Phone */}
                        <div>
                            <label
                                className="block text-sm mb-1"
                                htmlFor="phoneNumber"
                            >
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-orange-500 text-sm"
                                placeholder="Phone number"
                                aria-label="Phone Number"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-orange-500 text-sm"
                            placeholder="Enter your email"
                            aria-label="Email Address"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            className="block text-sm mb-1"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-orange-500 text-sm"
                            placeholder="Enter your password"
                            aria-label="Password"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-sm rounded-md font-medium ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-800 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                        }`}
                    >
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <a
                        href="/auth/login"
                        className="font-medium text-orange-500 hover:underline"
                    >
                        Log in instead
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
