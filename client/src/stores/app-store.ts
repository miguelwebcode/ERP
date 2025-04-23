import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AppState = {
  user: User | null;
  selectedCustomerId: string;
  selectedProjectId: string;
  selectedEmployeeId: string;
};

export type AppActions = {
  setUser: (user: User | null) => void;
  setSelectedCustomerId: (selectedCustomerId: string) => void;
  setSelectedProjectId: (selectedProjectId: string) => void;
  setSelectedEmployeeId: (selectedEmployeeId: string) => void;
};

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    user: null,
    selectedCustomerId: "",
    selectedProjectId: "",
    selectedEmployeeId: "",
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
    setSelectedEmployeeId: (selectedEmployeeId) => {
      set({ selectedEmployeeId });
    },
  }))
);
