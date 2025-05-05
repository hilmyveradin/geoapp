import { create } from "zustand";

const useCardStore = create((set) => ({
  isCtrlPressed: false,
  selectedCards: [],

  setIsCtrlPressed: (isPressed) => set(() => ({ isCtrlPressed: isPressed })),

  toggleCardSelection: (cardId) =>
    set((state) => {
      const isSelected = state.selectedCards.includes(cardId);
      return {
        selectedCards: isSelected
          ? state.selectedCards.filter((id) => id !== cardId)
          : [...state.selectedCards, cardId],
      };
    }),

  clearSelection: () => set(() => ({ selectedCards: [] })),
}));

export default useCardStore;
