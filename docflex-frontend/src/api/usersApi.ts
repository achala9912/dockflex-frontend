import axiosAuth from "@/lib/axiosAuth";

export interface Role {
  _id: string;
  roleId?: string;
  roleName: string;
  permissions: string[];
  isDeleted: boolean;
  modificationHistory: any[];
  createdAt: string;
  updatedAt?: string;
  __v: number;
}

export interface Center {
  _id: string;
  centerName: string;
}

export interface User {
  _id: string;
  userId: string;
  title?: string;
  name?: string;
  userName: string;
  role: Role;
  centerId?: Center;
  gender?: string;
  slmcNo?: string;
  specialization?: string;
  email?: string;
  contactNo?: string;
  remarks?: string;
  isActive: boolean;
  isNewUser: boolean;
  isDeleted: boolean;
  isAdminUser: boolean;
  modificationHistory: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetAllUsersResponse {
  data: User[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  userName?: string;
  roleId?: string;
}): Promise<GetAllUsersResponse> {
  try {
    const response = await axiosAuth.get<GetAllUsersResponse>("/users", {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
}

export async function createUser(data: any): Promise<any> {
  try {
    const response = await axiosAuth.post("/users", data);
    return response.data;
  } catch (err) {
    console.error("Failed to create user:", err);
    throw err;
  }
}
