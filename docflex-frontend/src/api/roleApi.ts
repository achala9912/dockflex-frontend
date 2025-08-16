import axiosAuth from "@/lib/axiosAuth";


export interface Role {
  _id: string;
  roleId: string;
  roleName: string;
  permissions: string[];
  isDeleted: boolean;
  modificationHistory: any[]; // you can type this more strictly if needed
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
}

// In your roleApi.ts file
export interface RolesResponse {
  data: Role[]; // This should be just Role[] if API returns array directly
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

// Update getAllRoles to handle both formats
export async function getAllRoles(
  page?: number,
  limit?: number,
  roleName?: string
): Promise<Role[] | RolesResponse> {
  try {
    const response = await axiosAuth.get("/roles", {
      params: { page, limit, roleName },
    });

    // Handle both array and object responses
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        totalPages: 1,
        currentPage: 1,
      };
    }
    return response.data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
