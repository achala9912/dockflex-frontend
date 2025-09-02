"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/schemas/Login/ForgotPassSchema";
import InputField from "@/components/InputField/InputField";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa6";
import { IoChevronBackSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { sendForgotPasswordOtp } from "@/api/authApis";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      const res = await sendForgotPasswordOtp(data.userName);
      console.log("OTP sent:", res);
      toast.success("OTP send successfully!");
      toast.info("Please check your email inbox.");
      router.push("/verifyPassword");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header with Back Button */}
      <div className="flex items-center gap-1 mb-4">
        <Tooltip content="Go back" side="bottom">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <IoChevronBackSharp size={22} />
          </button>
        </Tooltip>
        <h2 className="text-xl font-bold text-gray-900 font-inter">
          Forgot Password?
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* User Name Field */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="userName"
            className="text-sm font-medium text-gray-700"
          >
            User Name
          </label>
          <InputField
            id="userName"
            type="text"
            placeholder="Enter your username"
            className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            icon={<FaRegUser className="text-gray-400" />}
            {...register("userName")}
          />
          {errors.userName && (
            <p className="text-red-500 text-xs">{errors.userName.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <Button
            type="submit"
            variant="outline"
            size="default"
            disabled={loading}
            className="w-full h-10 flex items-center justify-center px-4 py-2 font-semibold text-white rounded-lg bg-[#0D6ACA] hover:bg-blue-800 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
