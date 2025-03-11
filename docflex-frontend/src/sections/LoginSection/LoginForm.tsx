"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormData } from "@/schemas/Login/LoginSchema"; 
import InputField from "@/components/InputField/InputField";
import PasswordField from "@/components/InputField/PasswordField";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong, FaRegUser } from "react-icons/fa6";

const LoginForm = () => {
    const router = useRouter();

    //Initialize react-hook-form with Zod validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    // Form Submission Handler
    const handleLogin = (data: LoginFormData) => {
        console.log("Logging in with:", data);
     
    };

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <h2 className="mb-4 text-xl font-bold text-gray-900 text-start font-inter">
                Welcome Back!
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                {/* User Name Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="userName" className="text-sm font-medium text-gray-700">
                        User Name
                    </label>
                    <InputField
                        id="userName"
                        type="text"
                        placeholder="Enter user name"
                        className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        icon={<FaRegUser className="text-gray-400" />}
                        {...register("userName")}
                    />
                    {errors.userName && <p className="text-red-500 text-xs">{errors.userName.message}</p>}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <PasswordField
                        id="password"
                        placeholder="Enter password"
                        className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        {...register("password")}
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                {/* Sign In Button */}
                <div className="mt-4">
                    <Button
                        type="submit"
                        variant="outline"
                        size="default"
                        className="w-full h-10 flex items-center justify-center px-4 py-2 font-semibold text-white rounded-lg bg-[#0D6ACA] hover:bg-blue-800 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign in
                        <FaArrowRightLong className="ml-2" />
                    </Button>
                </div>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-2 text-center">
                <button
                    type="button"
                    onClick={() => router.push("/forgotPassword")}
                    className="text-sm text-blue-700 hover:underline focus:outline-none hover:font-semibold"
                >
                    Forgot my password?
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
