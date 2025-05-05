import { create } from "zustand";

const useUserStore = create((set) => ({
  isAdmin: false,
  isEditor: false,
  setIsAdmin: (isAdmin) => set({ isAdmin }),

  setIsEditor: (isEditor) => set({ isEditor }),
}));

export default useUserStore;
