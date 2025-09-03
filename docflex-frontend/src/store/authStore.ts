import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { logoutUser } from "./session_storage";

export interface User {
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
  digitalSignature: string;
  profilePicture: string;
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
    // {
    //   name: "auth-store",
    //   storage: createJSONStorage(() => {
    //     // Always use sessionStorage to isolate sessions per tab
    //     return sessionStorage;
    //   }),
    // }
    {
      name: "auth-store",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return sessionStorage;
        }
        // Fallback to empty storage on SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Key fix: Avoid double rehydration
      skipHydration: true,
    }
  )
);
