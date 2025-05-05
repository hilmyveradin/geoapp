"use client";

import { useEffect, useRef, useState } from "react";
import useMapViewStore from "./store/useMapViewStore";

const useLayerManager = () => {
  const { mapLoaded, map, selectedLayers, mapData } = useMapViewStore();
  const currentLayersRef = useRef([]);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (mapLoaded && map && selectedLayers.length) {
      // // Iterate over the currentLayers to remove layers not in selectedLayers
      currentLayersRef.current.forEach((layerId) => {
        if (!selectedLayers.some((layer) => layer.layerUid === layerId)) {
          // debugger;
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          if (map.getSource(layerId)) {
            // debugger;
            map.removeSource(layerId);
          }
        }
      });

      // // Clear the ref and repopulate it with the current selectedLayers' ids
      currentLayersRef.current = [];

      selectedLayers.forEach((layer) => {
        currentLayersRef.current.push(layer.layerUid); // Track the layer being added
        const url = `http://dev3.webgis.co.id/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.pgTableName}&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG:3857&styles=&format=image%2Fpng&transparent=true`;

        if (!map?.getSource(layer.layerUid)) {
          map.addSource(layer.layerUid, {
            type: "raster",
            tiles: [url],
            tileSize: 256, // Make sure to include tileSize if necessary for raster sources
            maxZoom: 22, // Adjusted for better detail
          });

          map.addLayer({
            id: layer.layerUid,
            type: "raster",
            source: layer.layerUid,
            layout: {
              visibility: "visible",
            },
          });
        }
      });

      if (firstRender) {
        map.fitBounds(mapData.mapBbox, { padding: 40, maxZoom: 12 }); // Adjust padding as needed
        setFirstRender(false);
      }
    }
  }, [mapLoaded, selectedLayers, map, mapData.mapBbox]); // Ensure map is a dependency if it's coming from a store or context
};

export default useLayerManager;
