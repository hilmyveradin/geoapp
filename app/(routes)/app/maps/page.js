"use client";

import ClientPagination from "@/app/_components/app/client-pagination";
import MapsButtons from "@/app/_components/app/map-buttons";
import useRefetchStore from "@/helpers/hooks/store/useRefetchStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const MapsDashboard = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [mapsData, setMapsData] = useState([]);
  const { refetchMaps } = useRefetchStore();

  useEffect(() => {
    // Define function to get layers API
    async function getMapsData() {
      try {
        const response = await fetch("/api/get-maps", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const temp = await response.json();

        const tempData = temp.data
          .map((data) => {
            //TODO: Change this maptitle to camelCase
            return {
              ...data,
              cardType: "map",
              cardTitle: data.mapTitle,
              cardUid: data.mapUid,
              thumbnailUrl: `http://dev3.webgis.co.id/be/cms/map/thumbnail/${data.thumbnailUrl}`,
            };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMapsData(tempData);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      } finally {
        setPageLoading(false);
      }
    }

    getMapsData()
      // make sure to catch any error
      .catch(console.error);
  }, [refetchMaps]);

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
        <MapsButtons />
      </div>
      {/* Pagination */}
      {mapsData.length > 0 ? (
        <ClientPagination data={mapsData} />
      ) : (
        <div className="flex items-center justify-center w-full h-96">
          <p> You do not have any maps. Add a new one! </p>
        </div>
      )}
    </div>
  );
};

export default MapsDashboard;
