import axiosAuth from "@/lib/axiosAuth";
import axios from "axios";

export async function getDashboardData({
  centerId,
}: {
  centerId: string;
}): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/dashboard", {
      params: { centerId },
    });
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch dashboard."
      );
    }
    throw err;
  }
}
