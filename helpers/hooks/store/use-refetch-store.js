import { create } from "zustand";

const useRefetchStore = create((set) => ({
  refetchMaps: true,
  refetchLayers: true,
  refetchMapLayers: true,

  toggleRefetchMaps: () =>
    set((state) => ({
      refetchMaps: !state.refetchMaps,
    })),

  toggleRefetchLayers: (state) =>
    set((state) => ({
      refetchLayers: !state.refetchLayers,
    })),

  setRefetchMapLayers: (newRefetchMapLayers) =>
    set(() => ({
      refetchMapLayers: newRefetchMapLayers,
    })),
}));

export default useRefetchStore;
