import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { logoutUser } from "./local_storage";


interface User {
  _id: string;
  userId: string;
  title: string;
  name: string;
  userName: string;
  role: RoleType;
  centerId: string;
  gender: string;
  slmcNo: string;
  specialization: string;
  email: string;
  contactNo: string;
  remarks: string;
  isActive: boolean;
  isNewUser: boolean;
  isDeleted: boolean;
  isAdminUser: boolean;
}
export type RoleType = {
  _id: string;
  roleId: string;
  roleName: string;
  permissions: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user) => {
        set({ isAuthenticated: true, user });
      },
      logout: () => {
        logoutUser();
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => {
        try {
          localStorage.setItem("test", "test");
          localStorage.removeItem("test");
          return localStorage;
        } catch {
          return sessionStorage;
        }
      }),
    }
  )
);