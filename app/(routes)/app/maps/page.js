"use client";

import ClientPagination from "@/app/_components/app/client-pagination";
import MapsButtons from "@/app/_components/app/map-buttons";
import { useEffect, useState } from "react";

const MapsDashboard = () => {
  const [mapsData, setMapsData] = useState([]);

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

        const tempData = temp.data.map((data) => {
          return {
            cardType: "map",
            cardTitle: data.mapTitle,
            cardUid: data.mapUid,
            ...data,
          };
        });

        setMapsData(tempData);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }

    getMapsData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  if (mapsData.length === 0) {
    return <div> loading </div>;
  }

  return (
    <div className="w-full h-full px-8 mt-4">
      <div className="mb-4">
        <MapsButtons />
      </div>
      {/* Pagination */}
      <ClientPagination data={mapsData} />
    </div>
  );
};

export default MapsDashboard;
