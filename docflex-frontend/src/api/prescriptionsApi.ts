import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllPrescriptions(
  date: string,
  page?: number,
  limit?: number,
  search?: string,
  centerId?: string,
  productId?: string,
  status?: string
): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/prescriptions", {
      params: { page, date, limit, search, productId, centerId, status },
    });
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch prescriptions."
      );
    }
    throw err;
  }
}

export async function getPrescriptionDataById(
  prescriptionNo: string
): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/prescriptions/${prescriptionNo}`);
    return res;
  } catch (error) {
    console.error(
      `Error fetching prescriptions data with ID ${prescriptionNo}:`,
      error
    );
    throw error;
  }
}
