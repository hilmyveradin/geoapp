import { useEffect, useRef, useState } from "react";
import useMapViewStore from "./store/useMapViewStore";

const usePopUpManager = () => {
  const { mapLoaded, map, selectedLayers, mapClicked, setMapClicked, tableLoaded, setObjectInfoData } = useMapViewStore();
  // Assuming you have a reference to the event listener function
  useEffect(() => {
    const clickHandler = async function(e) {
      console.log(e.lngLat.wrap().lng);
      console.log(e.lngLat.wrap().lat);
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
        setObjectInfoData(data);
        setMapClicked(false);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }
  
    if (mapLoaded && map && map !== undefined ) {
      map.off('click', clickHandler);
      // add map on click function
      map.on('click', clickHandler);
    }
    
  }, [map, mapLoaded, selectedLayers])
};

export default usePopUpManager;