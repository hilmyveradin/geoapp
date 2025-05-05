import { create } from "zustand";

const useRefetchStore = create((set) => ({
  refetchMaps: true,
  refetchLayers: true,
  refetchMapLayers: true,

  toggleRefetchMaps: () =>
    set((state) => ({
      refetchMaps: !state.refetchMaps,
    })),

  setRefetchLayers: (newRefetchLayers) =>
    set(() => ({
      refetchLayers: newRefetchLayers,
    })),

  setRefetchMapLayers: (newRefetchMapLayers) =>
    set(() => ({
      refetchMapLayers: newRefetchMapLayers,
    })),
}));

export default useRefetchStore;
