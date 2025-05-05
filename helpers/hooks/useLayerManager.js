import { useEffect, useRef, useState } from "react";
import useMapViewStore from "./store/useMapViewStore";

const useLayerManager = () => {
  const { mapLoaded, map, mapData, mapLayers, reorderLayer } =
    useMapViewStore();
  const [firstRender, setFirstRender] = useState(true);
  const layerOrderRef = useRef([]); // Tracks the intended order of all layers, initialized once
  const layerReorderRef = useRef(false); // Tracks the intended trigger reorder layer

  useEffect(() => {
    // Reset and reinitialize layers when reorderMaps changes
    // Remove all layers
    if (layerReorderRef.current !== reorderLayer) {
      layerOrderRef.current.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
          map.removeSource(layerId);
        }
      });

      layerOrderRef.current = mapLayers
        .map((layer) => layer.layerUid)
        .reverse();
      layerReorderRef.current = reorderLayer;
    }
  }, [map, mapLayers, reorderLayer]);

  useEffect(() => {
    if (mapLoaded && map) {
      const updateLayers = () => {
        // Initialize layerOrderRef only once on first effective load
        if (layerOrderRef.current.length === 0 && mapLayers.length > 0) {
          layerOrderRef.current = mapLayers
            .map((layer) => layer.layerUid)
            .reverse();
        }

        // Process each layer in mapLayers according to the initial order in layerOrderRef
        layerOrderRef.current.forEach((layerId) => {
          const layer = mapLayers.find((l) => l.layerUid === layerId);
          if (!layer) {
            // If layer is not present in current mapLayers but exists on the map, hide it
            if (map.getLayer(layerId)) {
              map.setLayoutProperty(layerId, "visibility", "none");
            }
            return;
          }

          const url = `http://dev3.webgis.co.id/geoserver/geoportal/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.layerName}&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG:3857&styles=&format=image%2Fpng&transparent=true`;

          // Add or update existing layer
          if (!map.getSource(layerId)) {
            // Add new source and layer if it does not exist
            map.addSource(layerId, {
              type: "raster",
              tiles: [url],
              tileSize: 256,
              maxZoom: 22,
            });
            map.addLayer({
              id: layerId,
              type: "raster",
              source: layerId,
              layout: { visibility: layer.isShown ? "visible" : "none" },
            });
          } else {
            // Update visibility of existing layers
            map.setLayoutProperty(
              layerId,
              "visibility",
              layer.isShown ? "visible" : "none"
            );
          }
        });
      };

      if (mapLayers.length === 0) {
        // Optionally clear layers if no selection
        layerOrderRef.current.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
            map.removeSource(layerId);
          }
        });
        layerOrderRef.current = [];
      } else {
        updateLayers();
      }

      if (firstRender && mapData.mapBbox) {
        map.fitBounds(mapData.mapBbox, { padding: 40, maxZoom: 12 });
        setFirstRender(false);
      }
    }
  }, [firstRender, map, mapData.mapBbox, mapLoaded, mapLayers, reorderLayer]);
};

export default useLayerManager;
