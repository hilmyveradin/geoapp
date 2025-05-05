import { create } from "zustand";

const useTableQueryStore = create((set) => ({
  ftsQuery: null,
  reloadTable: false,
  searchSubmit: false,

  setFtsQuery: (query) =>
    set(() => ({
      ftsQuery: query,
    })),

  setReloadTable: (data) =>
    set(() => ({
      reloadTable: data,
    })),

  setSearchSubmit: (data) =>
    set(() => ({
      searchSubmit: data,
    })),
}));

export default useTableQueryStore;
