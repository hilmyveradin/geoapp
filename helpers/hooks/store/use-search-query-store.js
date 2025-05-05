import { create } from "zustand";

const useSearchQueryStore = create((set) => ({
  searchedTitle: "",
  searchedMapTitle: "",
  setSearchedTitle: (data) => set(() => ({ searchedTitle: data })),
  setSearchedMapTitle: (data) => set(() => ({ searchedMapTitle: data })),
}));
  
export default useSearchQueryStore;
  