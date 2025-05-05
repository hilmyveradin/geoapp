import { useEffect } from "react";
import useMapViewStore from "./store/useMapViewStore";
import useRefetchStore from "./store/useRefetchStore";

const useUpdateLayer = () => {
  const { setMapLayers, mapData } = useMapViewStore();
  const { refetchMapLayers } = useRefetchStore();
  useEffect(() => {
    async function getLayerUid(layerUid) {
      const response = await fetch(
        `/api/layers/get-layer-id?layerUid=${layerUid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const datas = await response.json();
      const modifiedDatas = datas.data.map((data) => {
        return {
          ...data,
          imageUrl: `http://dev3.webgis.co.id/be/cms/layer/thumbnail/${data.thumbnailUrl}`,
          legendUrl: `http://dev3.webgis.co.id/be/cms/layer/legend/${data.layerUid}`,
        };
      });

      return modifiedDatas;
    }

    // mapUid as parameter
    async function loadMapData() {
      try {
        const response = await fetch(
          `/api/maps/get-map-id?mapUid=${mapData.mapUid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();
        const data = { ...responseData.data, mapType: mapType };
        // Create an array of promises
        const layerDataPromises = data.mapLayerUid.map((layerUid) =>
          getLayerUid(layerUid)
        );
        // Wait for all promises to resolve
        const resolvedLayerDatas = await Promise.all(layerDataPromises);

        // Flatten the array of arrays (if necessary) and set the state
        const layerDatas = resolvedLayerDatas.flat(); // Use .flat() if each promise resolves to an array

        setMapLayers(layerDatas);
      } catch (error) {
        console.log(error);
      }
    }

    loadMapData();
  }, [mapData.mapUid, refetchMapLayers, setMapLayers]);
};

export default useUpdateLayer;
