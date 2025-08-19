import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllSessions(
  page?: number,
  limit?: number,
  search?: string,
  centerId?: string,
  isActive?: boolean
): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/sessions", {
      params: { page, limit, search, isActive, centerId },
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch sessions."
      );
    }
    throw err;
  }
}

export async function createSession(data: any): Promise<any> {
  try {
    const response = await axiosAuth.post("/sessions", data);
    return response.data;
  } catch (err) {
    console.error("Failed to create session:", err);
    throw err;
  }
}
