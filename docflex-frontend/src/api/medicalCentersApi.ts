import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export interface MedicalCenter {
  _id: string;
  centerId?: string;
  centerName: string;
  town: string;
  contactNo: string;
  email: string;
  address: string;
  logo?: string;
  regNo?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export async function createMedicalCenter(
  data: Omit<
    MedicalCenter,
    "centerId" | "_id" | "createdAt" | "updatedAt" | "isDeleted"
  >
): Promise<MedicalCenter> {
  try {
    const res = await axiosAuth.post<MedicalCenter>("/medical-centers", data);
    return res.data;
  } catch (error) {
    console.error("Error creating medical center:", error);
    throw error;
  }
}

export async function getAllMedicalCenters(
  page?: number,
  limit?: number,
  search?: string
): Promise<MedicalCenter[]> {
  try {
    const res = await axiosAuth.get<MedicalCenter[]>("/medical-centers", {
      params: { page, limit, search },
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch medical centers."
      );
    }
    throw err;
  }
}

export async function getMedicalCentersById(centerId: string): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/medical-centers/${centerId}`);
    return res;
  } catch (error) {
    console.error(`Error fetching center with ID ${centerId}:`, error);
    throw error;
  }
}

export async function deleteMedicalCenters(centerId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/medical-centers/${centerId}`);
  } catch (error) {
    console.error(`Error deleting medical center with ID ${centerId}:`, error);
    throw error;
  }
}

export async function updateMedicalCenters(
  centerId: string,
  data: Partial<MedicalCenter>
): Promise<MedicalCenter> {
  try {
    const res = await axiosAuth.put<MedicalCenter>(
      `/medical-centers/${centerId}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(`Error updating center with ID ${centerId}:`, error);
    throw error;
  }
}

export async function getMedicalCenterSuggestions(): Promise<any[]> {
  try {
    const response = await axiosAuth.get<any[]>(`/medical-centers/constants`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch MedicalCenter suggestions:", err);
    throw err;
  }
}
