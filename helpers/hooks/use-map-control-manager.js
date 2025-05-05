import { useEffect, useRef } from "react";
import useMapViewStore from "./store/use-map-view-store";
import useMapSidebarStore from "./store/use-map-sidebar-store";
import MapLibreGL from "maplibre-gl";

const useMapControlManager = () => {
  const { map } = useMapViewStore();
  const { showRightSidebar } = useMapSidebarStore();
  const navControlRef = useRef(null);

  useEffect(() => {
    if (map && !navControlRef.current) {
      navControlRef.current = new MapLibreGL.NavigationControl();
      map.addControl(navControlRef.current, "top-right");
    }

    if (navControlRef.current) {
      navControlRef.current._container.className =
        navControlRef.current._container.className.replace(
          /absolute right-\d+/,
          ""
        );
      navControlRef.current._container.className += showRightSidebar
        ? " absolute right-28" // Tailwind class for right 100px
        : " absolute right-12";
    }
  }, [map, showRightSidebar]);
};

export default useMapControlManager;
