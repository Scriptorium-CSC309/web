import React, { useState, useContext, useRef, useEffect } from "react";
import Avatar from "@/frontend/components/Avatar";
import {
    StateContext as UserStateContext,
    DispatchContext as UserDispatchContext,
} from "@/frontend/contexts/UserContext";
import api from "@/frontend/utils/api";
import { NUM_AVATARS } from "@/constants";
import { HiOutlinePencil } from "react-icons/hi";
import withAuth from "@/frontend/utils/auth";
import { useRouter } from "next/router";
import LoadingScreen from "@/frontend/components/LoadingScreen";

const ProfilePage = () => {
    const userDispatch = useContext(UserDispatchContext);
    const user = useContext(UserStateContext);
    const router = useRouter();

    if (!user) {
        router.push("/auth/login");
        return <LoadingScreen />;
    }

    const { isAdmin, id, ...initialFormData } = user;
    const [formData, setFormData] = useState(initialFormData);

    const [editableFields, setEditableFields] = useState({
        name: false,
        email: false,
        phoneNumber: false,
    });

    const inputRefs = {
        name: useRef<HTMLInputElement>(null),
        email: useRef<HTMLInputElement>(null),
        phoneNumber: useRef<HTMLInputElement>(null),
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const isChanged =
        JSON.stringify(formData) !== JSON.stringify(initialFormData);

    const toggleEditableField = (field: keyof typeof editableFields) => {
        setEditableFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    useEffect(() => {
        Object.keys(inputRefs).forEach((field) => {
            if (editableFields[field as keyof typeof inputRefs]) {
                inputRefs[field as keyof typeof inputRefs].current?.focus();
            }
        });
    }, [editableFields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleAvatarChange = (id: number) => {
        setFormData((prev) => ({ ...prev, avatarId: id }));
    };

    const handleBlur = (field: keyof typeof editableFields) => {
        setEditableFields((prev) => ({ ...prev, [field]: false }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await api.patch("/user/profile", formData);
            if (response.status === 200) {
                userDispatch({ type: "UPDATE_PROFILE", payload: formData });
                setSuccess(true);
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error || "Failed to update profile.";
            setError(errorMessage);

            // Revert to the initial state on failure
            const { isAdmin, id, ...newFormData } = user;
            setFormData(newFormData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full flex justify-center items-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-2xl p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                    My Profile
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {["name", "phoneNumber"].map((field) => (
                            <div key={field}>
                                <label
                                    htmlFor={field}
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    {field === "name"
                                        ? "Full Name"
                                        : "Phone Number"}
                                </label>
                                <div className="relative">
                                    <input
                                        ref={
                                            inputRefs[
                                                field as keyof typeof inputRefs
                                            ]
                                        }
                                        type={
                                            field === "phoneNumber"
                                                ? "tel"
                                                : "text"
                                        }
                                        id={field}
                                        value={
                                            formData[
                                                field as keyof typeof formData
                                            ]
                                        }
                                        onChange={handleChange}
                                        disabled={
                                            !editableFields[
                                                field as keyof typeof editableFields
                                            ]
                                        }
                                        onBlur={() =>
                                            handleBlur(
                                                field as keyof typeof editableFields
                                            )
                                        }
                                        className={`w-full px-4 py-3 pr-10 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border ${
                                            editableFields[
                                                field as keyof typeof editableFields
                                            ]
                                                ? "border-blue-500 focus:ring-blue-500 focus:border-blue-500"
                                                : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    />
                                    {!editableFields[
                                        field as keyof typeof editableFields
                                    ] && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleEditableField(
                                                    field as keyof typeof editableFields
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center px-2 text-sm font-medium text-blue-600 dark:text-blue-400"
                                        >
                                            <HiOutlinePencil className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                ref={inputRefs.email}
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!editableFields.email}
                                onBlur={() => handleBlur("email")}
                                className={`w-full px-4 py-3 pr-10 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border ${
                                    editableFields.email
                                        ? "border-blue-500 focus:ring-blue-500 focus:border-blue-500"
                                        : "border-gray-300 dark:border-gray-600"
                                }`}
                            />
                            {!editableFields.email && (
                                <button
                                    type="button"
                                    onClick={() => toggleEditableField("email")}
                                    className="absolute inset-y-0 right-0 flex items-center px-2 text-sm font-medium text-blue-600 dark:text-blue-400"
                                >
                                    <HiOutlinePencil className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Avatar Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Choose Avatar
                        </label>
                        <div className="flex space-x-4 mt-2">
                            {Array(NUM_AVATARS)
                                .fill(0)
                                .map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`rounded-full p-1 border-4 transition ${
                                            formData.avatarId === index + 1
                                                ? "border-blue-500"
                                                : "border-transparent hover:border-gray-400"
                                        }`}
                                        onClick={() =>
                                            handleAvatarChange(index + 1)
                                        }
                                    >
                                        <Avatar
                                            avatarId={index + 1}
                                            width={64}
                                            height={64}
                                            className="rounded-full"
                                        />
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    {/* Success Message */}
                    {success && (
                        <p className="text-sm text-green-500 text-center">
                            Profile updated successfully!
                        </p>
                    )}

                    {/* Save Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={!isChanged || loading}
                            className={`w-full py-3 font-semibold rounded-md text-white ${
                                !isChanged || loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                            }`}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
