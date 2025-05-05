import { create } from "zustand";

const useUserStore = create((set) => ({
  userList: [],
  setUserList: (data) => set(() => ({ userList: data })),
}));

export default useUserStore;
