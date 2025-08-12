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
      throw new Error(
        err.response?.data?.message || "Login request failed."
      );
    }

    throw err;
  }
}
