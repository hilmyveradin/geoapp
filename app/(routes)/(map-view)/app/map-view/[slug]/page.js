"use client";

import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main";
import MapSidebar from "@/app/_components/app/map-view/map-sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MapViewLayout from "../../../layout";
import MapSidebarRight from "@/app/_components/app/map-view/map-sidebar-right";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";

const MapView = ({ params }) => {
  const mapUid = params.slug;

  const { mapData, layersData, setMapData, setSelectedLayers, setLayersData } =
    useMapViewStore();

  useEffect(() => {
    async function getLayerUid(layerUid) {
      const response = await fetch(`/api/get-layer-id?layerUid=${layerUid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = await response.json();
      const modifiedDatas = datas.data.map((data) => {
        return {
          ...data,
          imageUrl: `http://dev3.webgis.co.id/be/cms/layer/thumbnail/${data.thumbnailUrl}`,
        };
      });

      return modifiedDatas;
    }

    async function loadMapData() {
      try {
        const response = await fetch(`/api/get-map-id?mapUid=${mapUid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();
        const data = responseData.data;
        // Create an array of promises
        const layerDataPromises = data.mapLayerUid.map((layerUid) =>
          getLayerUid(layerUid)
        );
        // Wait for all promises to resolve
        const resolvedLayerDatas = await Promise.all(layerDataPromises);

        // Flatten the array of arrays (if necessary) and set the state
        const layerDatas = resolvedLayerDatas.flat(); // Use .flat() if each promise resolves to an array

        setSelectedLayers(layerDatas);
        setLayersData(layerDatas);
        setMapData(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadMapData();
  }, [mapUid, setLayersData, setMapData, setSelectedLayers]);

  if (!mapData && !layersData) return <div>Loading...</div>;

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

MapView.getLayout = function (page) {
  return <MapViewLayout>{page}</MapViewLayout>;
};

export default MapView;
