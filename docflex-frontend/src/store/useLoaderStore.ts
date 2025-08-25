// import {create} from 'zustand';

// type LoaderState = {
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// };

// export const useLoaderStore = create<LoaderState>((set) => ({
//     loading: false,
//     setLoading: (loading: boolean) => set({ loading }),
//   }));

import { create } from "zustand";

type LoaderState = {
  activeRequests: number;
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

export const useLoaderStore = create<LoaderState>((set, get) => ({
  activeRequests: 0,
  loading: false,
  startLoading: () => {
    const { activeRequests } = get();
    const newCount = activeRequests + 1;
    console.log("🔵 startLoading →", newCount);
    set({ activeRequests: newCount, loading: true });
  },
  stopLoading: () => {
    const { activeRequests } = get();
    const newCount = Math.max(0, activeRequests - 1);
    console.log("🟢 stopLoading →", newCount);
    set({ activeRequests: newCount, loading: newCount > 0 });
  },
}));
