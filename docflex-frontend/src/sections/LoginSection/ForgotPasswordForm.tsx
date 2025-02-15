"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField/InputField";
import { Button } from "@/components/ui/button";
import { FaRegUser, FaEnvelope } from "react-icons/fa6";
import { IoChevronBackSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";

const ForgotPasswordForm = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Reset password request for:", { userName, email });
        // Implement API call or form submission logic here
    };

    return (
        <div className="w-full max-w-md">
            {/* Header with Back Button */}
            <div className="flex items-center gap-1 mb-4">
                <Tooltip content="Go back" side="bottom">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                        <IoChevronBackSharp size={22} />
                    </button>
                </Tooltip>
                <h2 className="text-xl font-bold text-gray-900 font-inter">Forgot Password?</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* User Name Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="userName" className="text-sm font-medium text-gray-700">
                        User Name
                    </label>
                    <InputField
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your username"
                        className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        icon={<FaRegUser className="text-gray-400" />}
                    />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <InputField
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        icon={<FaEnvelope className="text-gray-400" />}
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                    <Button
                        type="submit"
                        variant="outline"
                        size="default"
                        className="w-full h-10 flex items-center justify-center px-4 py-2 font-semibold text-white rounded-lg bg-[#0D6ACA] hover:bg-blue-800 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
