import { create } from "zustand";

const useLayerStore = create((set) => ({
  layers: [],

  setLayers: (newLayers) =>
    set(() => ({
      layersData: newLayers,
    })),

  addLayers: (newLayers) =>
    set((state) => ({
      layersData: [...state.layersData, ...newLayers],
    })),

  removeLayers: (layerIdsToRemove) =>
    set((state) => ({
      layersData: state.layersData.filter(
        (layer) => !layerIdsToRemove.includes(layer.id)
      ),
    })),
}));

export default useLayerStore;
