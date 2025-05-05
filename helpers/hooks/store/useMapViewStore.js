import { create } from "zustand";

const useMapViewStore = create((set) => ({
  map: null,
  mapLoaded: false,
  selectedLayers: null,
  mapData: null,
  mapLayers: null,
  layerInfo: {
    layerUid: null,
    layerTitle: null,
  },
  selectedLayerTableUid: null,
  tableLoaded: true,
  zoomedLayerBbox: null,
  mapClicked: true,
  objectInfoData: null,
  multiSelectedLayers: [],
  deletedLayerUids: [],
  refreshLayerOrder: false,
  isLayerReordered: false,
  currentViewBbox: null,
  addedLayerUids: [],
  selectedPopupLayer: null,

  setMap: (data) => set(() => ({ map: data })),

  setMapLoaded: (data) =>
    set(() => ({
      mapLoaded: data,
    })),

  setMapData: (data) =>
    set(() => ({
      mapData: data,
    })),

  setMapLayers: (data) =>
    set(() => ({
      mapLayers: data,
    })),

  addMapLayers: (data) =>
    set((state) => ({
      mapLayers: [data, ...(state.mapLayers || [])],
    })),

  replaceMapLayersLayerProp: (newData) =>
    set((state) => ({
      mapLayers: state.mapLayers
        ? state.mapLayers.map((layer) =>
            layer.layerUid === newData.layerUid
              ? { ...layer, ...newData }
              : layer
          )
        : [newData],
    })),

  removeMapLayers: (data) =>
    set((state) => ({
      mapLayers: state.mapLayers.filter((layer) => layer !== data),
    })),

  toggleLayerVisibility: (layerUid, visible) =>
    set((state) => ({
      mapLayers: state.mapLayers.map((layer) =>
        layer.layerUid === layerUid ? { ...layer, isShown: visible } : layer
      ),
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

  setMapClicked: (data) =>
    set(() => ({
      mapClicked: data,
    })),

  setObjectInfoData: (data) =>
    set(() => ({
      objectInfoData: data,
    })),

  setMultiSelectedLayers: (data) =>
    set(() => ({
      multiSelectedLayers: data,
    })),

  addMultiSelectedLayers: (data) =>
    set((state) => ({
      multiSelectedLayers: [...(state.multiSelectedLayers || []), data],
    })),

  removeMultiSelectedLayers: (data) =>
    set((state) => ({
      multiSelectedLayers: state.multiSelectedLayers.filter(
        (layer) => layer.layerUid !== data.layerUid
      ),
    })),

  addDeletedLayerUids: (data) =>
    set((state) => ({
      deletedLayerUids: [...(state.deletedLayerUids || []), data],
    })),

  resetDeletedLayerUids: () =>
    set(() => ({
      deletedLayerUids: [],
    })),

  addAddedLayerUids: (data) =>
    set((state) => ({
      addedLayerUids: [...(state.addedLayerUids || []), data],
    })),

  resetAddedLayerUids: () =>
    set(() => ({
      addedLayerUids: [],
    })),

  toggleRefreshLayerOrder: () => {
    set((state) => ({
      refreshLayerOrder: !state.refreshLayerOrder,
    }));
  },

  setIsLayerReordered: (data) => {
    set(() => ({
      isLayerReordered: data,
    }));
  },

  setCurrentViewBbox: (data) => {
    set(() => ({
      currentViewBbox: data,
    }));
  },
  setSelectedPopupLayer: (data) =>
    set(() => ({
      selectedPopupLayer: data,
    })),
}));

export default useMapViewStore;
