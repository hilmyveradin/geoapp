import { create } from "zustand";

const useMapViewStore = create((set) => ({
  selectedLayers: null,
  mapData: null,
  layersData: null,

  setMapData: (data) =>
    set(() => ({
      mapData: data,
    })),

  setLayersData: (data) =>
    set(() => ({
      layersData: data,
    })),

  setSelectedLayers: (data) =>
    set(() => ({
      selectedLayers: data,
    })),
}));

export default useMapViewStore;
