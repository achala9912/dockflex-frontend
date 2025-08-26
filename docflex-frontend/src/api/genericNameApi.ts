import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

// ✅ cleaner & extensible
export async function getAllGenericNames({
  page,
  limit,
  search,
  centerId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  centerId?: string;
}): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/generic", {
      params: { page, limit, search, centerId },
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

export async function deleteGenericName(genericId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/generic/${genericId}`);
  } catch (error) {
    console.error(`Error deleting generic with ID ${genericId}:`, error);
    throw error;
  }
}
