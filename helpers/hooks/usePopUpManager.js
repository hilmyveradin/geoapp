import { useEffect, useRef, useCallback } from "react";
import useMapViewStore from "./store/useMapViewStore";

const usePopUpManager = () => {
  const { mapLoaded, map, mapData, setMapClicked, mapClicked, setObjectInfoData } = useMapViewStore();

  const clickHandler = useCallback( 
    async function(e) {
      const { mapLayers } = useMapViewStore.getState(); 

      const body = {
        layer_uid: mapLayers.filter(layer => layer.isShown).map(layer => layer.layerUid),
        coord: [e.lngLat.wrap().lng, e.lngLat.wrap().lat],
        zoomLevel: parseInt(map.getZoom()),
      };

      try {
        const response = await fetch(`/api/get-object-info?mapUid=${mapData.mapUid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === "success") {
          setObjectInfoData(data);
          setMapClicked(false);
        }
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    },
    [map, mapData.mapUid, setMapClicked, setObjectInfoData]
  );

  // Assuming you have a reference to the event listener function
  useEffect(() => {
    if (mapLoaded && map && map !== undefined ) {
      map.off('click');
     // add map on click function
      map.on('click', clickHandler);
    }
  }, [mapLoaded, map, clickHandler])
};

export default usePopUpManager;