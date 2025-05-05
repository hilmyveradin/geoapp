import { useEffect, useRef, useState } from "react";
import useMapViewStore from "./store/useMapViewStore";

const usePopUpManager = () => {
  const { mapLoaded, map, selectedLayers, mapData } = useMapViewStore();
  // Assuming you have a reference to the event listener function
  const clickHandler = async function(e) {
    console.log(e.point.x);
    console.log(e.point.y);
    console.log(map.getZoom());
    console.log(selectedLayers);

    const body = {
      layers: selectedLayers.map((layer) => ({
        layer_uid: layer.layerUid,
      })),
      coord: [e.lngLat.wrap().lng, e.lngLat.wrap().lat],
      zoomLevel: parseInt(map.getZoom()),
    };

    try {
      const response = await fetch(`/api/get-object-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  }

  useEffect(() => {
    if (mapLoaded && map && map !== undefined ) {
      map.off('click', clickHandler);
      console.log(selectedLayers);
      // add map on click function
      map.on('click', clickHandler);
    }
  }, [map, mapLoaded, selectedLayers])
};

export default usePopUpManager;