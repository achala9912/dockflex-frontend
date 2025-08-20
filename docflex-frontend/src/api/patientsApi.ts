import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllPatients(
  page?: number,
  limit?: number,
  search?: string,
  centerId?: string
): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/patients", {
      params: { page, limit, search, centerId },
    });
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch patients."
      );
    }
    throw err;
  }
}

export async function updatePatient(
  patientId: string,
  updateData: Partial<any>
): Promise<any> {
  try {
    const res = await axiosAuth.put<any>(`/patients/${patientId}`, updateData);
    return res.data;
  } catch (error) {
    console.error(`Error updating patient with ID ${patientId}:`, error);
    throw error;
  }
}

export async function getPatientById(patientId: string): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/patients/${patientId}`);
    return res;
  } catch (error) {
    console.error(`Error fetching patient with ID ${patientId}:`, error);
    throw error;
  }
}

export async function deletePatient(patientId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/patients/${patientId}`);
  } catch (error) {
    console.error(`Error deleting patient with ID ${patientId}:`, error);
    throw error;
  }
}
