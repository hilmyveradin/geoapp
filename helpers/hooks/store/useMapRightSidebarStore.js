import { create } from "zustand";

const useMapRightSidebar = create((set) => ({
	showRightSidebar: false,
	expandedRightSidebarButtons: false,

	setShowRightSidebar: (data) =>
		set(() => ({
			showRightSidebar: data,
		})),

	setExpandedRightSidebarButtons: (data) =>
		set(() => ({
			expandedRightSidebarButtons: data,
		})), 
}));

export default useMapRightSidebar;