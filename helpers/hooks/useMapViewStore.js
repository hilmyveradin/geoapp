import { create } from "zustand";

const useMapViewStore = create((set) => ({
  selectedLayers: null,
  mapData: null,
  layersData: null,

  setMapData: (data) =>
    set(() => ({
      mapData: data,
    })),

  addLayersData: (data) =>
    set((state) => ({
      layersData: [...(state.layersData || []), data],
    })),

  setLayersData: (data) =>
    set(() => ({
      layersData: data,
    })),

  setSelectedLayers: (data) =>
    set(() => ({
      selectedLayers: data,
    })),

  addSelectedLayers: (data) =>
    set((state) => ({
      selectedLayers: [...(state.selectedLayers || []), data],
    })),

  removeSelectedLayers: (data) =>
    set((state) => ({
      selectedLayers: state.selectedLayers.filter((layer) => layer !== data),
    })),
}));

export default useMapViewStore;
