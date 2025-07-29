import { create } from "zustand";

const useSearchQueryStore = create((set) => ({
  searchedTitle: "",
  searchedMapTitle: "",
  searchedGroupTitle: "",
  setSearchedTitle: (data) => set(() => ({ searchedTitle: data })),
  setSearchedMapTitle: (data) => set(() => ({ searchedMapTitle: data })),
  setSearchedGroupTitle: (data) => set(() => ({ searchedGroupTitle: data })),
}));

export default useSearchQueryStore;
