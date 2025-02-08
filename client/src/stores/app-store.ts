import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AppState = {
  user: User | null;
  selectedCustomerId: string;
  selectedProjectId: string;
};

export type AppActions = {
  setUser: (user: User | null) => void;
  setSelectedCustomerId: (selectedCustomerId: string) => void;
  setSelectedProjectId: (selectedProjectId: string) => void;
};

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => {
      set(() => ({
        user,
      }));
    },
    setSelectedCustomerId: (selectedCustomerId) => {
      set({ selectedCustomerId });
    },
    setSelectedProjectId: (selectedProjectId) => {
      set({ selectedProjectId });
    },
  }))
);
