import { useEffect } from "react";
import useMapViewStore from "./store/use-map-view-store";

const useZoomToLayer = () => {
  const { mapLoaded, map, zoomedLayerBbox, setZoomedLayerBbox } =
    useMapViewStore();

  useEffect(() => {
    if (mapLoaded && map && map !== undefined && zoomedLayerBbox) {
      if (zoomedLayerBbox) {
        map.fitBounds(zoomedLayerBbox, {
          animate: false,
          padding: 40,
          maxZoom: 16,
        }); // Adjust padding as needed
        setZoomedLayerBbox(null);
      }
    }
  }, [map, zoomedLayerBbox, mapLoaded, setZoomedLayerBbox]);
};

export default useZoomToLayer;
