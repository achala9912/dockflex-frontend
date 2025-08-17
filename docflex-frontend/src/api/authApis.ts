import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";
import type { User } from "@/store/authStore";
import { HttpResponse } from "@/types/httpResponseType";

export interface LoginResponse {
  mustResetPassword: boolean;
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

    console.log("Axios Login full response:", res);

    const responseData = res.data ?? (res as unknown as LoginResponse);

    if (!responseData || typeof responseData !== "object") {
      throw new Error("Invalid data received from server");
    }

    return responseData;
  } catch (err: unknown) {
    console.error("Axios Login error:", err);
    throw err;
  }
}

export async function sendForgotPasswordOtp(
  userName: string
): Promise<HttpResponse<any>> {
  try {
    const res = await axiosAuth.post<HttpResponse<any>>(
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

export async function verifyOtpAndResetPassword(
  userName: string,
  otp: string,
  newPassword: string
): Promise<HttpResponse<any>> {
  try {
    const res = await axiosAuth.post<HttpResponse<any>>(
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

export async function firstLoginResetPassword(
  userName: string,
  newPassword: string
): Promise<HttpResponse<any>> {
  try {
    const res = await axiosAuth.post<HttpResponse<any>>(
      "/auth/reset-first-login-password",
      { userName, newPassword }
    );

    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to reset first login password."
      );
    }
    throw err;
  }
}
