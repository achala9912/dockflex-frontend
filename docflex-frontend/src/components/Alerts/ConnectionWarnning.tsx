"use client";

import React, { useState, useEffect } from "react";
import { FiWifiOff, FiCheckCircle } from "react-icons/fi";

const ConnectionWarning: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [showOnlineMessage, setShowOnlineMessage] = useState(false);

    // Effect to handle connection status
    useEffect(() => {
        const handleOffline = () => {
            setIsOffline(true);
            setShowOnlineMessage(false);
        };

        const handleOnline = () => {
            setIsOffline(false);
            setShowOnlineMessage(true);
            setTimeout(() => setShowOnlineMessage(false), 3000);
        };

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    return (
        <>
            {/* Background Dimmer for Offline */}
            {isOffline && <div className="fixed inset-0 z-50 bg-black/50"></div>}

            {/* Offline Banner */}
            {isOffline && <Banner type="offline" />}

            {/* Online Banner */}
            {showOnlineMessage && <Banner type="online" />}
        </>
    );
};

// Component: Banner
interface BannerProps {
    type: "online" | "offline";
}

const Banner: React.FC<BannerProps> = ({ type }) => {
    const isOffline = type === "offline";
    const icon = isOffline ? <FiWifiOff className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />;
    const bgColor = isOffline
        ? "bg-gradient-to-r from-red-500 to-red-600"
        : "bg-gradient-to-r from-green-500 to-green-600";
    const message = isOffline
        ? { title: "You're Offline", description: "Some features may not work." }
        : { title: "You're Back Online", description: "All features are available." };

    return (
        <div
            className={`fixed z-50 flex items-center w-9/12 max-w-sm px-4 py-2 space-x-3 text-white transform -translate-x-1/2 rounded-lg shadow-md top-4 left-1/2 ${bgColor} animate-fade-in font-inter`}
        >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-opacity-30 ${isOffline ? "bg-red-700" : "bg-green-700"}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold">{message.title}</p>
                <p className="text-xs">{message.description}</p>
            </div>
        </div>
    );
};

export default ConnectionWarning;
