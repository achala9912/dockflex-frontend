import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllAppointments(
  page?: number,
  limit?: number,
  search?: string,
  centerId?: string,
  isPatientvisited?: boolean
): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/appointments", {
      params: { page, limit, search, isPatientvisited, centerId },
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch appointments."
      );
    }
    throw err;
  }
}
