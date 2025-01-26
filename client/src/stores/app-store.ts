import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AppState = {
  user: User | null;
  isEditingCustomer: boolean;
  selectedCustomerId: string;
};

export type AppActions = {
  setUser: (user: User | null) => void;
  setIsEditingCustomer: (isEditingCustomer: boolean) => void;
  setSelectedCustomerId: (selectedCustomerId: string) => void;
};

export type AppStore = AppState & AppActions;

// export const defaultInitState: AppState = {
//   user: null,
// };

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    user: null,
    editCustomer: false,
    setUser: (user) => {
      set(() => ({
        user,
      }));
    },
    setIsEditingCustomer: (isEditingCustomer) => {
      set({ isEditingCustomer });
    },
    setSelectedCustomerId: (selectedCustomerId) => {
      set({ selectedCustomerId });
    },
  }))
);
