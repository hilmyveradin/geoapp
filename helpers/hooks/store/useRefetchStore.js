import { create } from "zustand";

const useRefetchStore = create((set) => ({
  refetchMaps: true,
  refetchLayers: true,

  setRefetchMaps: (newRefetchMaps) =>
    set(() => ({
      refetchMaps: newRefetchMaps,
    })),

  setRefetchLayers: (newRefetchLayers) =>
    set(() => ({
      refetchMaps: newRefetchLayers,
    })),
}));

export default useRefetchStore;
