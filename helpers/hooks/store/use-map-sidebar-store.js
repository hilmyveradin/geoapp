import { create } from "zustand";

const useMapSidebarStore = create((set) => ({
  showRightSidebar: false,
  expandedRightSidebarContent: false,
  showLeftSidebar: false,
  expandedLeftSidebarContent: false,

  setShowLeftSidebar: (data) =>
    set(() => ({
      showLeftSidebar: data,
    })),

  setExpandedLeftSidebarContent: (data) =>
    set(() => ({
      expandedLeftSidebarContent: data,
    })),

  setShowRightSidebar: (data) =>
    set(() => ({
      showRightSidebar: data,
    })),

  setExpandedRightSidebarContent: (data) =>
    set(() => ({
      expandedRightSidebarContent: data,
    })),
}));

export default useMapSidebarStore;
