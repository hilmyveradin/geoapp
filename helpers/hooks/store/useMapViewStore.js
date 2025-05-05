import { create } from "zustand";

const useMapViewStore = create((set) => ({
  map: null,
  mapLoaded: false,
  selectedLayers: null,
  mapData: null,
  layersData: null,
  layerInfo: {
    layerUid: null,
    layerTitle: null,
  },
  selectedLayerTableUid: null,
  tableLoaded: true,
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
      layersData: [data, ...(state.layersData || [])],
    })),

  removeLayersData: (data) =>
    set((state) => ({
      layersData: state.layersData.filter((layer) => layer !== data),
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

  setLayerInfo: (layerUid, layerTitle) =>
    set((state) => ({
      layerInfo: { layerUid, layerTitle },
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
