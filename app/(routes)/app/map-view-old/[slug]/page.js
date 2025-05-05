"use client";

import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main-old";
import MapSidebar from "@/app/_components/app/map-view/map-sidebar-old";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";

const MapView = ({ params }) => {
  const mapUid = params.slug;

  const { mapData, layersData, setMapData, addLayersData, addSelectedLayers } =
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
      addLayersData(modifiedDatas[0]);
      addSelectedLayers(modifiedDatas[0]);
    }

    async function loadMapData() {
      try {
        const response = await fetch(`/api/get-map-id?mapUid=${mapUid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const datas = await response.json();
        const modifiedDatas = datas.data;
        modifiedDatas.mapLayerUid.forEach((layerUid) => {
          getLayerUid(layerUid);
        });
        setMapData(modifiedDatas);
      } catch (error) {
        console.log(error);
      }
    }

    loadMapData();
  }, [addLayersData, mapUid, setMapData]);

  if (!mapData && !layersData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      {/* <MapHeader /> */}
      <div className="flex items-center justify-center">
        <MapSidebar />
        <div className="w-screen h-[calc(100vh-112px)]">
          <MapMain />
        </div>
      </div>
    </div>
  );
};

export default MapView;
