import React, { useState } from "react";

type SaveTemplateModalProps = {
    initialTemplateFields?: {
        title: string;
        description: string;
        tags: string[];
    };
    onSave: (template: {
        title: string;
        description: string;
        tags: string[];
    }) => void;
    onClose: () => void;
    isEditing: boolean;
};

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
    initialTemplateFields: {
        title: initialTitle = "",
        description: initialDescription = "",
        tags: initialTags = [],
    } = {},
    onSave,
    onClose,
    isEditing,
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const validateFields = () => {
        const newErrors: { title?: string; description?: string } = {};

        if (!title.trim()) {
            newErrors.title = "Title is required.";
        }

        if (!description.trim()) {
            newErrors.description = "Description is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateFields()) {
            return;
        }

        onSave({ title: title.trim(), description: description.trim(), tags });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 md:w-[500px] shadow-lg">
                {/* Title Input */}
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a title"
                        className={`mt-1 w-full p-2 border ${
                            errors.title
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-700"
                        } rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your template"
                        className={`mt-1 w-full p-2 border ${
                            errors.description
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-700"
                        } rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none`}
                        rows={4}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Tags Input */}
                <div className="mb-4">
                    <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Tags
                    </label>
                    <div className="flex items-center mt-1">
                        <input
                            id="tags"
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a tag"
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button
                            onClick={handleAddTag}
                            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                            >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:ring focus:ring-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
                    >
                        {isEditing ? "Save Changes" : "Save Template"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveTemplateModal;
