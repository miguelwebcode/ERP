import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AppState = {
  user: User | null;
};

export type AppActions = {
  setUser: (user: User | null) => void;
};

export type AppStore = AppState & AppActions;

// export const defaultInitState: AppState = {
//   user: null,
// };

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => {
      console.log("Desde el store");
      set(() => ({
        user,
      }));
    },
  }))
);
