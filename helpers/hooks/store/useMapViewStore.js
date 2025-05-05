import { create } from "zustand";

const useMapViewStore = create((set) => ({
  map: null,
  mapLoaded: false,
  selectedLayers: null,
  mapData: null,
  layersData: null,
  selectedLayerTableUid: null,
  tableLoaded: false,
  zoomedLayerBbox: null,

  setMap: (data) => set(() => ({ map: data })),

  setMapLoaded: (data) =>
    set(() => ({
      mapLoaded: data,
    })),

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

  setSelectedLayerTableUid: (data) =>
    set(() => ({
      selectedLayerTableUid: data,
    })),

  setTableLoaded: (data) =>
    set(() => ({
      tableLoaded: data,
    })),

  setZoomedLayerBbox: (data) =>
    set(() => ({
      zoomedLayerBbox: data,
    })),
}));

export default useMapViewStore;
