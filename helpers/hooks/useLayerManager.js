import { useEffect, useRef, useState } from "react";
import useMapViewStore from "./store/useMapViewStore";

const useLayerManager = () => {
  const { mapLoaded, map, selectedLayers, mapData } = useMapViewStore();
  const layerOrderRef = useRef([]); // Tracks the intended order of layers
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (mapLoaded && map) {
      console.log(selectedLayers);
      const updateLayers = () => {
        // Remove layers that are not in selectedLayers
        layerOrderRef.current.forEach((layerId) => {
          if (!selectedLayers.some((layer) => layer.layerUid === layerId)) {
            if (map.getLayer(layerId)) {
              map.setLayoutProperty(layerId, "visibility", "none"); // Hide layer instead of removing
            }
          }
        });

        // Add or show layers from selectedLayers
        selectedLayers.forEach((layer, index) => {
          const layerId = layer.layerUid;
          const url = `http://dev3.webgis.co.id/geoserver/geoportal/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.layerName}&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG:3857&styles=&format=image%2Fpng&transparent=true`; // your existing URL construction

          if (!map.getSource(layerId)) {
            // Add new source and layer
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
              layout: { visibility: "visible" },
            });

            layerOrderRef.current.push(layerId); // Add to order tracking
          } else {
            // Ensure layer is visible
            map.setLayoutProperty(layerId, "visibility", "visible");
          }

          // // Reorder layers according to layerOrderRef
          // if (index > 0) {
          //   map.moveLayer(layerId, layerOrderRef.current[index - 1]);
          // }
        });

        // Update layerOrderRef to match selectedLayers
        layerOrderRef.current = selectedLayers.map((layer) => layer.layerUid);
      };

      if (selectedLayers.length === 0) {
        // Optionally clear layers if no selection
        layerOrderRef.current.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          if (map.getSource(layerId)) {
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
  }, [firstRender, map, mapData.mapBbox, mapLoaded, selectedLayers]);
};

export default useLayerManager;
