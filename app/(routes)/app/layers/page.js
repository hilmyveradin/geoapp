"use client";

import { useEffect, useState } from "react";
import ClientPagination from "@/app/_components/app/client-pagination";
import LayersButtons from "@/app/_components/app/layer-buttons";
import { Loader2 } from "lucide-react";
import useRefetchStore from "@/helpers/hooks/store/useRefetchStore";

const LayersDashboard = () => {
  const [layersData, setLayers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { refetchLayers } = useRefetchStore();

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

        const tempLayers = temp.data
          .map((data) => {
            return {
              ...data,
              cardType: "layer",
              cardTitle: data.layerTitle,
              cardUid: data.layerUid,
              thumbnailUrl: `http://dev3.webgis.co.id/be/cms/layer/thumbnail/${data.thumbnailUrl}`,
            };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setLayers(tempLayers);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      } finally {
        setPageLoading(false);
      }
    }

    getLayersData();
  }, [refetchLayers]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full px-8 mt-4">
      <div className="mb-4">
        <LayersButtons />
      </div>
      {/* Pagination */}
      {layersData.length > 0 ? (
        <ClientPagination data={layersData} />
      ) : (
        <div className="flex items-center justify-center w-full h-96">
          <p>
            {" "}
            <p> You do not have any layers data. Add a new one! </p>
          </p>
        </div>
      )}
    </div>
  );
};

export default LayersDashboard;
