"use client";

import AppHeader from "@/app/_components/app/shared/header";
import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main";
import MapSidebar from "@/app/_components/app/map-view/map-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MapView = ({ params }) => {
  const [layerData, setLayerData] = useState(null);
  const layerUid = params.slug;
  const router = useRouter();

  useEffect(() => {
    async function loadLayerData() {
      if (layerUid) {
        try {
          const response = await fetch(
            `/api/get-layer-id?layerUid=${layerUid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          setLayerData(data.data[0]);
        } catch (error) {
          console.log(error);
        }
      }
    }

    loadLayerData();
  }, [layerUid]);

  if (!layerData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <MapHeader data={layerData} />
      <div className="flex items-center justify-center">
        <MapSidebar data={layerData} />
        <div className="w-screen h-[calc(100vh-112px)]">
          <MapMain data={layerData} />
        </div>
      </div>
    </div>
  );
};

export default MapView;
