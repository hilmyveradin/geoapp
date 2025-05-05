import { useEffect } from "react";
import useMapViewStore from "./store/useMapViewStore";

const useZoomToLayer = () => {
  const { mapLoaded, map, zoomedLayerBbox } = useMapViewStore();

  useEffect(() => {
    if (mapLoaded && map && map !== undefined) {
      if (zoomedLayerBbox) {
        map.fitBounds(zoomedLayerBbox, { padding: 40, maxZoom: 12 }); // Adjust padding as needed
      }
    }
  }, [map, zoomedLayerBbox, mapLoaded]);
};

export default useZoomToLayer;
