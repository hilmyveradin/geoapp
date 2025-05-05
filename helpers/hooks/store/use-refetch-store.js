import { create } from "zustand";

const useRefetchStore = create((set) => ({
  refetchMaps: true,
  refetchLayers: true,
  refetchMapLayers: true,
  refetchGroups: true,
  refetchUsers: true,
  refetchChangeLayerProps: true,

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

  toggleRefetchGroups: () =>
    set((state) => ({
      refetchGroups: !state.refetchGroups,
    })),

  toggleRefetchUsers: () =>
    set((state) => ({
      refetchUsers: !state.refetchUsers,
    })),

  toggleRefetchChangeLayerProps: () =>
    set((state) => ({
      refetchChangeLayerProps: !state.refetchChangeLayerProps,
    })),
}));

export default useRefetchStore;
