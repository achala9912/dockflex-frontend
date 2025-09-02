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

export async function createProduct(data: any): Promise<any> {
  try {
    const response = await axiosAuth.post("/products", data);
    return response.data;
  } catch (err) {
    console.error("Failed to create products:", err);
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

export async function getProductById(productId: string): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/products/${productId}`);
    return res;
  } catch (error) {
    console.error(`Error fetching products with ID ${productId}:`, error);
    throw error;
  }
}

export async function updateProduct(
  productId: string,
  updateData: Partial<any>
): Promise<any> {
  try {
    const res = await axiosAuth.put<any>(`/products/${productId}`, updateData);
    return res.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
}

export async function getProductSuggestions(centerId: string): Promise<any[]> {
  try {
    if (!centerId) {
      throw new Error("centerId is required to fetch product suggestions.");
    }

    const response = await axiosAuth.get<any[]>(`/products/suggestions`, {
      params: { centerId },
    });

    return response.data;
  } catch (err) {
    console.error("Failed to fetch product suggestions:", err);
    throw err;
  }
}
