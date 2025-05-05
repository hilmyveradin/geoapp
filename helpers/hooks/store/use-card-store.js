import { create } from "zustand";

const useCardStore = create((set) => ({
  isCtrlPressed: false,
  selectedCards: [],
  cardDimension: { width: 0, height: 0 },

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

  setCardDimensions: (dimensions) => set(() => ({ cardDimension: dimensions })),
}));

export default useCardStore;
