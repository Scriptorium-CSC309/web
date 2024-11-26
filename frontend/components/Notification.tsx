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
            className={`fixed top-4 right-4 z-50 flex items-center justify-between w-96 px-6 py-3 border-l-4 ${
                type === "success"
                    ? "bg-green-500 border-green-600"
                    : "bg-red-500 border-red-600"
            } shadow-md`}
            style={{
                animation: "fadeIn 0.3s ease-in-out",
                fontFamily: "Arial, sans-serif",
                fontWeight: "500",
            }}
        >
            <span className="text-sm flex-1">{message}</span>
            <button
                onClick={onClose}
                className={`ml-4 text-sm text-gray-600 hover:text-gray-950 focus:outline-none`}
            >
                Dismiss
            </button>
        </div>
    );
};

export default Notification;
