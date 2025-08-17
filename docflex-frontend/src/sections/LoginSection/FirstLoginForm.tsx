"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FirstLoginSchema,
  FirstLoginFormData,
} from "@/schemas/Login/FirstLoginSchema";
import InputField from "@/components/InputField/InputField";
import PasswordField from "@/components/InputField/PasswordField";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa6";
import { firstLoginResetPassword } from "@/api/authApis";
import { toast } from "react-toastify";
import { GiConfirmed } from "react-icons/gi";

interface FirstLoginFormProps {
  userName: string;
  onSuccess?: () => void; 
}

const FirstLoginForm: React.FC<FirstLoginFormProps> = ({ userName, onSuccess }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FirstLoginFormData>({
    resolver: zodResolver(FirstLoginSchema),
    defaultValues: { userName },
  });

  const [newPassword, confirmNewPassword] = watch(["newPassword", "confirmNewPassword"]);

  const onSubmit = async (data: FirstLoginFormData) => {
    try {
      setLoading(true);
      const res = await firstLoginResetPassword(
        data.userName,
        data.newPassword
      );
      console.log("First Login Password reset:", res);
      toast.success("Password changed successfully!");
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/"); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center gap-1 mb-4">
        <h2 className="text-xl font-bold text-gray-900 font-inter">
          Reset Password
        </h2>
        <p className="text-xs text-gray-400">
          Please reset your password before continuing
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* User Name */}
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
            disabled
          />
          {errors.userName && (
            <p className="text-red-500 text-xs">{errors.userName.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray-700"
          >
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

        {/* Confirm New Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmNewPassword"
            className="text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            Confirm New Password
            {newPassword && confirmNewPassword && newPassword === confirmNewPassword && (
              <GiConfirmed color="green" />
            )}
          </label>
          <PasswordField
            id="confirmNewPassword"
            placeholder="Confirm your new password"
            className="h-10 bg-[#FAFBFE] border shadow-sm rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
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

export default FirstLoginForm;
