import axios from "axios";
import axiosAuth from "@/lib/axiosAuth";

export async function getAllProducts({
  page,
  limit,
  search,
  centerId,
  genericId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  centerId?: string;
  genericId?: string;
}): Promise<any> {
  try {
    const res = await axiosAuth.get<any>("/products", {
      params: { page, limit, search, centerId, genericId },
    });
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch product."
      );
    }
    throw err;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/products/${productId}`);
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
}
