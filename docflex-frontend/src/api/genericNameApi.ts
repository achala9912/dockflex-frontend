import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllGenericNames({
  centerId,
  page,
  limit,
  search,
}: {
  centerId: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/generic", {
      params: { centerId, page, limit, search },
      skipLoading: true,
    });
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch generic."
      );
    }
    throw err;
  }
}

export async function createGenericName(data: any): Promise<any> {
  try {
    const response = await axiosAuth.post("/generic", data);
    return response.data;
  } catch (err) {
    console.error("Failed to create generic:", err);
    throw err;
  }
}

export async function getGenericNameById(genericId: string): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/generic/${genericId}`);
    return res;
  } catch (error) {
    console.error(`Error fetching generic with ID ${genericId}:`, error);
    throw error;
  }
}

export async function updateGenericName(
  genericId: string,
  updateData: Partial<any>
): Promise<any> {
  try {
    const res = await axiosAuth.put<any>(`/generic/${genericId}`, updateData);
    return res.data;
  } catch (error) {
    console.error(`Error updating generic with ID ${genericId}:`, error);
    throw error;
  }
}

export async function deleteGenericName(genericId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/generic/${genericId}`);
  } catch (error) {
    console.error(`Error deleting generic with ID ${genericId}:`, error);
    throw error;
  }
}
