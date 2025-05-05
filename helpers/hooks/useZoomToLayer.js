import { useEffect } from "react";
import useMapViewStore from "./store/useMapViewStore";

const useZoomToLayer = () => {
  const { mapLoaded, map, zoomedLayerBbox, setZoomedLayerBbox } =
    useMapViewStore();

  useEffect(() => {
    if (mapLoaded && map && map !== undefined && zoomedLayerBbox) {
      if (zoomedLayerBbox) {
        map.fitBounds(zoomedLayerBbox, { padding: 40, maxZoom: 12 }); // Adjust padding as needed
        setZoomedLayerBbox(null);
      }
    }
  }, [map, zoomedLayerBbox, mapLoaded, setZoomedLayerBbox]);
};

export default useZoomToLayer;
