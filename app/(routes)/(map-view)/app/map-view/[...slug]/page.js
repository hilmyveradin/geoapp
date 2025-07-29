"use client";

import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main";
import { useEffect, useState } from "react";
import MapViewLayout from "../../../layout";
import { Loader2 } from "lucide-react";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";

const MapView = ({ params }) => {
  const mapType = params.slug[0];
  const mapUid = params.slug[1];
  const [isLoading, setIsLoading] = useState(true);

  const { mapData, mapLayers, setMapData, setSelectedLayers, setMapLayers } =
    useMapViewStore();

  const { refetchChangeLayerProps } = useRefetchStore();

  useEffect(() => {
    async function loadLayerData() {
      try {
        const response = await fetch(
          `/api/layers/get-layer-id?layerUid=${mapUid}`,
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
            mapBbox: data.layerBbox,
            mapTitle: data.layerTitle,
            imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cms/thumbnail/${data.thumbnailUrl}/layer`,
            legendUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cms/layer/${data.layerUid}/legend`,
            mapType: mapType,
            mapUid: mapUid,
            isShown: true,
          };
        });
        setMapLayers(modifiedDatas);
        setMapData(modifiedDatas[0]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    loadLayerData();
  }, [
    mapType,
    mapUid,
    setMapLayers,
    setMapData,
    setSelectedLayers,
    refetchChangeLayerProps,
  ]);

  if ((!mapData && !mapLayers) || isLoading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col">
      <MapHeader />
      <div className="flex items-center justify-center">
        {/* adjust this paddign if there's a style sidebar*/}
        <div className="w-screen h-[calc(100vh-56px)]">
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
