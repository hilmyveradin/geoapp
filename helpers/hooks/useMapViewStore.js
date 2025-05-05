const useMapViewStore = create((set) => ({
  selectedData: null,

  setSelectedData: (data) =>
    set(() => ({
      selectedData: data,
    })),
}));

export default useMapViewStore;
