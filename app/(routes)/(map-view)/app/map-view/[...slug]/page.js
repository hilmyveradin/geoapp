"use client";

import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main";
import MapSidebar from "@/app/_components/app/map-view/map-sidebar";
import { useEffect, useState } from "react";
import MapViewLayout from "../../../layout";
import { Loader2 } from "lucide-react";
import MapRightSidebar from "@/app/_components/app/map-view/map-right-sidebar";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import useUserStore from "@/helpers/hooks/store/use-user-store";

const MapView = ({ params }) => {
  const mapType = params.slug[0];
  const mapUid = params.slug[1];
  const [isLoading, setIsLoading] = useState(true);

  const { mapData, mapLayers, setMapData, setSelectedLayers, setMapLayers } =
    useMapViewStore();

  const { isAdmin, isEditor } = useUserStore();

  useEffect(() => {
    async function getLayerUid(layerUid) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/get-layer-id?layerUid=${layerUid}`,
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
          imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/be/cms/thumbnail/${data.thumbnailUrl}/layer`,
          legendUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/be/cms/layer/${data.layerUid}/legend`,
          isShown: true,
        };
      });

      return modifiedDatas;
    }

    async function loadMapData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/get-map-id?mapUid=${mapUid}`,
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

        const mapLayerPromises = data.mapLayerUids.map((layerUid) =>
          getLayerUid(layerUid)
        );
        // Wait for all promises to resolve
        const resolvedMapLayers = await Promise.all(mapLayerPromises);

        // Flatten the array of arrays (if necessary) and set the state
        const layerDatas = resolvedMapLayers.flat(); // Use .flat() if each promise resolves to an array

        setMapLayers(layerDatas);
        setMapData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    async function loadLayerData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/get-layer-id?layerUid=${mapUid}`,
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
            imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/be/cms/thumbnail/${data.thumbnailUrl}/layer`,
            legendUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/be/cms/layer/${data.layerUid}/legend`,
            mapType: mapType,
            mapUid: mapUid,
            isShown: true,
          };
        });
        // setSelectedLayers(modifiedDatas.reverse());
        setMapLayers(modifiedDatas);
        setMapData(modifiedDatas[0]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (mapType === "map") {
      loadMapData();
    } else {
      loadLayerData();
    }
  }, [mapType, mapUid, setMapLayers, setMapData, setSelectedLayers]);

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
        <MapSidebar />
        {/* adjust this paddign if there's a style sidebar*/}
        <div className="pl-12 w-screen h-[calc(100vh-56px)]">
          <MapMain />
        </div>
        {(isAdmin || isEditor) && <MapRightSidebar />}
      </div>
    </div>
  );
};

MapView.getLayout = function (page) {
  return <MapViewLayout>{page}</MapViewLayout>;
};

export default MapView;
