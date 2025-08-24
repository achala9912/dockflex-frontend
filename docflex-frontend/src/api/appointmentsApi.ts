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

export async function createAppointment(data: any): Promise<any> {
  try {
    const response = await axiosAuth.post("/appointments", data);
    return response.data;
  } catch (err) {
    console.error("Failed to create appointments:", err);
    throw err;
  }
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  try {
    await axiosAuth.patch(`/appointments/${appointmentId}/cancel`);
  } catch (error) {
    console.error(
      `Error cancelling appointment with ID ${appointmentId}:`,
      error
    );
    throw error;
  }
}


export async function accpetPatientVisiting(appointmentId: string): Promise<void> {
  try {
    await axiosAuth.patch(`/appointments/${appointmentId}/visit`);
  } catch (error) {
    console.error(
      `Error accpetPatientVisiting with ID ${appointmentId}:`,
      error
    );
    throw error;
  }
}
