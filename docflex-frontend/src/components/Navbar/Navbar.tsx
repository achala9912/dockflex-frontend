"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GoHome } from "react-icons/go";
import { GoScreenFull } from "react-icons/go";

const TopNavbar = () => {
    const router = useRouter();

    return (
        <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between rounded-lg">
            {/* Left Side - Home & Fullscreen Buttons */}
            <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-gray-900 transition">
                    <GoHome size={22} />
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition">
                    <GoScreenFull size={22} />
                </button>
            </div>

            {/* Center - Page Title */}
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>

            {/* Right Side - User Profile */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    {/* Radix UI Avatar */}
                    <Avatar>
                        <AvatarImage src="/profile.jpg" alt="User Avatar" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">Achala Imesh</p>
                        <p className="text-xs text-gray-500 text-left">AcHa@99</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => router.push("/")}
                >
                    <IoMdLogOut size={22} />
                </button>
            </div>
        </div>
    );
};

export default TopNavbar;
