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

export async function getSessionById(sessionId: string): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/sessions/${sessionId}`);
    return res;
  } catch (error) {
    console.error(`Error fetching session with ID ${sessionId}:`, error);
    throw error;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/sessions/${sessionId}`);
  } catch (error) {
    console.error(`Error deleting session with ID ${sessionId}:`, error);
    throw error;
  }
}

export async function updateSession(
  sessionId: string,
  updateData: Partial<any>
): Promise<any> {
  try {
    const res = await axiosAuth.put<any>(`/sessions/${sessionId}`, updateData);
    return res.data;
  } catch (error) {
    console.error(`Error updating session with ID ${sessionId}:`, error);
    throw error;
  }
}

export async function doActiveSession(
  sessionId: string,
  isActive: boolean
): Promise<any> {
  try {
    const res = await axiosAuth.patch(`/sessions/active/${sessionId}`, {
      isActive,
    });
    return res.data;
  } catch (error) {
    console.error(`Error toggle active session with ID ${sessionId}:`, error);
    throw error;
  }
}
