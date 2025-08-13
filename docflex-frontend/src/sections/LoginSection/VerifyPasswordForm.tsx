"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VerifyPasswordSchema,
  VerifyPasswordData,
} from "@/schemas/Login/VerifyPasswordSchema";
import InputField from "@/components/InputField/InputField";
import PasswordField from "@/components/InputField/PasswordField";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaRegUser } from "react-icons/fa6";
import { IoChevronBackSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { verifyOtpAndResetPassword } from "@/api/authApis";
import { toast } from "react-toastify";

const VerifyPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyPasswordData>({
    resolver: zodResolver(VerifyPasswordSchema),
  });

  const onSubmit = async (data: VerifyPasswordData) => {
    try {
      setLoading(true);
      const res = await verifyOtpAndResetPassword(
        data.userName,
        data.otp,
        data.newPassword
      );
      console.log("Password reset:", res);
      toast.success("Password reset successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
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
          Reset Password
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* User Name Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="userName" className="text-sm font-medium text-gray-700">
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

        {/* OTP Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="otp" className="text-sm font-medium text-gray-700">
            OTP
          </label>
          <InputField
            id="otp"
            type="number"
            placeholder="Enter OTP received via Email"
            className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            icon={<FaEnvelope className="text-gray-400" />}
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-red-500 text-xs">{errors.otp.message}</p>
          )}
        </div>

        {/* New Password Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <PasswordField
            id="newPassword"
            placeholder="Enter your new password"
            className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
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
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerifyPasswordForm;
