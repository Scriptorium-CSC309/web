import React, { createContext, useContext, useState } from "react";
import Notification from "@/frontend/components/Notification";

type NotificationContextProps = {
    showNotification: (
        message: string,
        type?: "success" | "error",
        duration?: number
    ) => void;
};

const NotificationContext = createContext<NotificationContextProps | null>(
    null
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notification, setNotification] = useState<{
        message: string;
        type: "success" | "error";
        duration?: number;
    } | null>(null);

    const showNotification = (
        message: string,
        type: "success" | "error" = "success",
        duration: number = 3000
    ) => {
        setNotification({ message, type, duration });
    };

    const handleClose = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onClose={handleClose}
                />
            )}
        </NotificationContext.Provider>
    );
};
