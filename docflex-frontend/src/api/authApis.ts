import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";
import type { User } from "@/store/authStore";

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  permissions: string[];
}

export async function loginUser(
  userName: string,
  password: string
): Promise<LoginResponse> {
  try {
    const res = await axiosAuth.post<LoginResponse>("/auth/login", {
      userName,
      password,
    });

    console.log("Axios full response:", res);

    // Some backends return data in res instead of res.data
    const responseData = res.data ?? (res as unknown as LoginResponse);

    if (!responseData || typeof responseData !== "object") {
      throw new Error("Invalid data received from server");
    }

    return responseData;
  } catch (err: unknown) {
    console.error("Axios error:", err);

    if (axios.isAxiosError(err)) {
      console.error("Axios error details:", err.response?.data);
      throw new Error(err.response?.data?.message || "Login request failed.");
    }

    throw err;
  }
}

export interface ForgotPasswordOtpResponse {
  success: boolean;
  message: string;
}

export async function sendForgotPasswordOtp(
  userName: string
): Promise<ForgotPasswordOtpResponse> {
  try {
    const res = await axiosAuth.post<ForgotPasswordOtpResponse>(
      "/auth/forgot-password/send-otp",
      { userName }
    );

    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Failed to send OTP.");
    }
    throw err;
  }
}


export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export async function verifyOtpAndResetPassword(
  userName: string,
  otp: string,
  newPassword: string
): Promise<VerifyOtpResponse> {
  try {
    const res = await axiosAuth.post<VerifyOtpResponse>(
      "/auth/forgot-password/verify-otp",
      { userName, otp, newPassword }
    );

    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to reset password."
      );
    }
    throw err;
  }
}
