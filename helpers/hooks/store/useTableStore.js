import { create } from "zustand";

const useTableStore = create((set) => ({
    bool: false,
    layerUid: null,
    updateBool: (prev) => set({bool: !prev}),
    updateLayerUid: (newLayerUid) => set({layerUid: newLayerUid})
}))