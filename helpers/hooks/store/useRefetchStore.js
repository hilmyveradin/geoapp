import { create } from "zustand";

const useRefetchStore = create((set) => ({
  refetchMaps: true,
  refetchLayers: true,
  refetchMapLayers: true,

  setRefetchMaps: (newRefetchMaps) =>
    set(() => ({
      refetchMaps: newRefetchMaps,
    })),

  setRefetchLayers: (newRefetchLayers) =>
    set(() => ({
      refetchMaps: newRefetchLayers,
    })),

  setRefetchMapLayers: (newRefetchMapLayers) =>
    set(() => ({
      refetchMapLayers: newRefetchMapLayers,
    })),
}));

export default useRefetchStore;
