import React, { useEffect } from "react";

type NotificationProps = {
    message: string;
    type?: "success" | "error";
    duration?: number; // Duration in milliseconds
    onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({
    message,
    type = "success",
    duration = 3000,
    onClose,
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg ${
                type === "success"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
            }`}
        >
            <span className="text-sm">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 text-white hover:text-gray-300 focus:outline-none"
            >
                ✕
            </button>
        </div>
    );
};

export default Notification;
