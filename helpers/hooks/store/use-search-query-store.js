import { create } from "zustand";

const useSearchQueryStore = create((set) => ({
  searchedTitle: "",
  setSearchedTitle: (data) => set(() => ({ searchedTitle: data })),
}));
  
export default useSearchQueryStore;
  