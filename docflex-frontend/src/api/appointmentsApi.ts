import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllAppointments(
  date: string,
  page?: number,
  limit?: number,
  search?: string,
  centerId?: string,
  isPatientvisited?: boolean
): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/appointments", {
      params: { page, date, limit, search, isPatientvisited, centerId },
    });
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch appointments."
      );
    }
    throw err;
  }
}
