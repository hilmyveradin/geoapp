import { create } from "zustand";

const useLayerStore = create((set) => ({
  mapsData: [],

  setMaps: (newMaps) =>
    set(() => ({
      mapsData: newMaps,
    })),

  addMaps: (newMaps) =>
    set((state) => ({
      layersData: [...state.mapsData, ...newMaps],
    })),

  removeMaps: (mapsIdToRemove) =>
    set((state) => ({
      mapsData: state.mapsData.filter(
        (map) => !mapsIdToRemove.includes(map.Uid)
      ),
    })),
}));

export default useLayerStore;
