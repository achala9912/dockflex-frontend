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

export interface CreateRolePayload {
  roleName: string;
  permissions: string[];
}
export async function createRole(payload: CreateRolePayload): Promise<Role> {
  try {
    const data = await axiosAuth.post("/roles", payload);
    return data as unknown as Role;
  } catch (err) {
    console.error("Failed to create role:", err);
    throw err;
  }
}

export interface UpdateRolePayload {
  roleName?: string;
  permissions?: string[];
}
export async function updateRole(
  roleId: string,
  payload: UpdateRolePayload
): Promise<Role> {
  try {
    const response = await axiosAuth.put<Role>(`/roles/${roleId}`, payload);
    return response.data;
  } catch (err) {
    console.error("Failed to update role:", err);
    throw err;
  }
}

export async function getRoleDataById(roleId: string): Promise<any> {
  try {
    const res = await axiosAuth.get<any>(`/roles/${roleId}`);
    return res;
  } catch (error) {
    console.error(`Failed to fetch role with ID ${roleId}:`, error);
    throw error;
  }
}

export async function deleteRoleById(roleId: string): Promise<void> {
  try {
    await axiosAuth.delete(`/roles/${roleId}`);
  } catch (err) {
    console.error("Failed to delete role:", err);
    throw err;
  }
}

export async function getUsersByRoleId(roleId: string): Promise<any[]> {
  try {
    const response = await axiosAuth.get<any[]>(`/roles/${roleId}/users`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch users by role:", err);
    throw err;
  }
}

export async function getRoleSuggestions(): Promise<any[]> {
  try {
    const response = await axiosAuth.get<any[]>(`/roles/constant`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch role suggestions:", err);
    throw err;
  }
}
