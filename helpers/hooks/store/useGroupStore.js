import { create } from "zustand";

const useGroupStore = create((set) => ({
  groupList: [],
  setGroupList: (data) => set(() => ({ groupList: data })),
}));

export default useGroupStore;
