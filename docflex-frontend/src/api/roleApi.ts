import axiosAuth from "@/lib/axiosAuth";

export interface Role {
  _id: string;
  roleId: string;
  roleName: string;
  permissions: string[];
  isDeleted: boolean;
  modificationHistory: any[];
  createdAt: string;
  updatedAt: string;
}

export interface RolesResponse {
  data: Role[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

export async function getAllRoles(
  page?: number,
  limit?: number,
  roleName?: string
): Promise<Role[] | RolesResponse> {
  try {
    const response = await axiosAuth.get("/roles", {
      params: { page, limit, roleName },
    });

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

export interface PermissionOption {
  label: string;
  value: string;
}

export interface PermissionConstants {
  user: PermissionOption[];
  role: PermissionOption[];
  center: PermissionOption[];
  patient: PermissionOption[];
  session: PermissionOption[];
  genericname: PermissionOption[];
  appointment: PermissionOption[];
}

export async function getPermissionConstants(): Promise<PermissionConstants> {
  try {
    const data = await axiosAuth.get("/roles/permission-constant");
    return data as unknown as PermissionConstants;
  } catch (err) {
    console.error("Failed to fetch permission constants:", err);
    throw err;
  }
}