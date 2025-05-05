"use client";

import { useEffect } from "react";
import ClientPagination from "@/app/_components/app/client-pagination";
import useLayerStore from "@/helpers/hooks/useLayerStore";
import LayersButtons from "@/app/_components/app/layer-buttons";

const LayersDashboard = () => {
  const { layersData, setLayers } = useLayerStore();

  // Define for rendering thumbnails every time page is changed
  useEffect(() => {
    // Define function to get layers API
    async function getLayersData() {
      try {
        const response = await fetch("/api/get-layers", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json();

        const IMAGE_BASE_URL = "http://dev3.webgis.co.id/be";

        const tempLayers = temp.data.map((layers) => {
          return {
            ...layers,
            thumbnailUrl: `${IMAGE_BASE_URL}/cms/layer/thumbnail/${layers.thumbnailUrl}`,
          };
        });
        setLayers(tempLayers);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }
    getLayersData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <div className="w-full h-full px-8 mt-4">
      <LayersButtons />
      {/* Pagination */}
      <ClientPagination data={layersData} />
    </div>
  );
};

export default LayersDashboard;
