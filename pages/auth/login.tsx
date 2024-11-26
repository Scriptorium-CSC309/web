import React, { useContext, useState } from "react";
import ScriptoriumLogo from "@/frontend/components/ScriptoriumLogo";
import api from "@/frontend/utils/api";
import { useRouter } from "next/router";
import {
    setAccessToken,
    setRefreshToken,
} from "@/frontend/utils/token-storage";
import {
    DispatchContext as UserDispatchContext,
    StateContext as UserStateContext,
} from "@/frontend/contexts/UserContext";

const LoginPage = () => {
    const userDispatch = useContext(UserDispatchContext); // Context to update user state
    const user = useContext(UserStateContext); // Context to update user state
    const router = useRouter();

    React.useEffect(() => {
        console.log("User context updated:", user);
    }, [user]);
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error state

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
            // Send POST request to /auth/login
            const response = await api.post("/auth/login", formData);
            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data;

                // Store tokens locally
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);

                // Fetch and store the user's profile in the context
                const profileResponse = await api.get("/user/profile", {
                    headers: {
                        "Cache-Control": "no-cache",
                    },
                });
                
                if (profileResponse.status === 200) {
                    userDispatch({
                        type: "LOGIN",
                        payload: profileResponse.data,
                    });
                    router.push("/code"); 
                } else {
                    setError("Unable to fetch profile information.");
                }
            } else {
                setError("Error Logging in.");
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error ||
                "Invalid login credentials. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-full px-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 pt-4 w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <ScriptoriumLogo />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-center mb-2">
                    Log in to{" "}
                    <span className="text-brand-blue">Scriptorium</span>
                </h2>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Enter your details below to log back in. If you don't have
                    an account, click the link at the bottom.
                </p>

                {/* Form */}
                <form className="space-y-3" onSubmit={handleSubmit}>
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
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm mt-4">
                    Don’t have an account?{" "}
                    <a
                        href="/auth/signup"
                        className="font-medium text-orange-500 hover:underline"
                    >
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
