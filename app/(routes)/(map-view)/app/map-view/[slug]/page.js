"use client";

import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main";
import MapSidebar from "@/app/_components/app/map-view/map-sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useMapViewStore from "@/helpers/hooks/useMapViewStore";
import MapViewLayout from "../../../layout";
import MapSidebarRight from "@/app/_components/app/map-view/map-sidebar-right";

const MapView = ({ params }) => {
  const layerUid = params.slug;
  const router = useRouter();

  const { mapData, setMapData, setLayersData } = useMapViewStore();

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

          const mapData = {
            title: data.data[0].layerTitle,
          };

          setMapData(mapData);
          setLayersData(data.data);
        } catch (error) {
          console.log(error);
        }
      }
    }

    loadLayerData();
  }, [layerUid, setLayersData, setMapData]);

  if (!mapData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <MapHeader />
      <div className="flex items-center justify-center">
        <MapSidebar />
        <MapSidebarRight />
        <div className="px-12 w-screen h-[calc(100vh-56px)]">
          <MapMain />
        </div>
      </div>
    </div>
  );
};


MapView.getLayout = function(page) {
  return <MapViewLayout>{page}</MapViewLayout>;
};

export default MapView;
