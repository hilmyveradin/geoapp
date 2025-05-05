import { useEffect, useRef } from "react";
import useMapViewStore from "./store/useMapViewStore";
import useMapRightSidebar from "./store/useMapRightSidebarStore";
import MapLibreGL from "maplibre-gl";

const useMapControlManager = () => {
  const { map } = useMapViewStore();
  const { showRightSidebar } = useMapRightSidebar();
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
