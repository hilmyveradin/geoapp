import { useEffect, useRef } from "react";
import useMapViewStore from "./store/use-map-view-store";

const useMapStyleManager = () => {
  const { map, mapStyle } = useMapViewStore();

  useEffect(() => {
    if (!map || !mapStyle) return;
    map.setStyle(mapStyle);
  }, [mapStyle, map]);
};

export default useMapStyleManager;
