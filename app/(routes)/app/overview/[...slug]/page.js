"use client";

import ShareDialog from "@/app/_components/app/shared/share-dialog";
import UserAvatar from "@/app/_components/app/shared/user-avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import dayjs from "dayjs";
import { Loader2, UserRound, Map } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MapOverview = ({ params }) => {
  const { setMapData, mapData } = useMapViewStore();
  const overviewType = params.slug[0];
  const overviewUid = params.slug[1];
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const endpoint =
          overviewType === "layer"
            ? `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/get-layer-id?layerUid=${overviewUid}`
            : `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/get-map-id?mapUid=${overviewUid}`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        const modifiedData =
          overviewType === "layer"
            ? {
                ...data.data[0],
                tags: data.data[0].layerTags,
                imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/cms/layer/thumbnail/${data.data[0].thumbnailUrl}`,
                owner: data.data[0].creator,
                mapType: overviewType,
                mapUid: overviewUid,
              }
            : {
                ...data.data,
                imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/cms/layer/thumbnail/${data.data.thumbnailUrl}`,
                owner: data.data.creator,
                mapType: overviewType,
                mapUid: overviewUid,
              };

        setMapData(modifiedData);
      } catch (error) {
        console.error("Error loading data:", error);
        // Consider adding error state and displaying to user
      }
    }

    loadData();
  }, [overviewUid, overviewType]);

  if (!mapData) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <h1 className="flex items-center px-4 text-xl sm:text-2xl font-bold text-white border shadow-xl text-start bg-nileBlue-600 h-14 rounded-lg">
        {mapData[overviewType === "layer" ? "layerTitle" : "mapTitle"]}
      </h1>
      <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10">
        <div className="w-full md:w-2/3">
          <AspectRatio ratio={450 / 200}>
            <img
              src={mapData.imageUrl}
              alt="Map overview"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col gap-8 w-full md:w-1/3 min-w-[288px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {/* {BUTTON_CONSTANTS.map((item) => (
              <Button
                onClick={item.action}
                key={`button-${item.title}`}
                className="w-full"
              >
                {item.title}
              </Button>
            ))} */}

            <Button
              onClick={() => {
                router.push(`/app/map-view/${overviewType}/${overviewUid}`);
              }}
              className="w-full"
            >
              Open in map viewer
            </Button>
            <ShareDialog>
              <Button className="w-full">Share</Button>
            </ShareDialog>
          </div>
          <div className="flex items-center space-x-2">
            <Map className="w-6 h-6 sm:w-7 sm:h-7" />
            <p className="text-sm sm:text-base">Feature Layer</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-sm sm:text-base">Owner</p>
              {/* <button
                className="flex items-center space-x-2 text-gableGreen-500 stroke-gableGreen-500"
                onClick={() => {}}
              >
                <UserRound className="w-5 h-5" />
                <span className="text-sm sm:text-base">Change owner</span>
              </button> */}
            </div>
            <div className="flex items-center space-x-2">
              <UserAvatar user={mapData.creator} />
              <p className="text-sm sm:text-base">{mapData.creator.fullName}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm sm:text-base">Date</p>
            <div className="flex justify-between">
              <p className="text-sm sm:text-base">Item created</p>
              <p className="text-sm sm:text-base">
                {dayjs(mapData.createdAt).format("MMM DD, YYYY")}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm sm:text-base">Item updated</p>
              <p className="text-sm sm:text-base">
                {mapData.updatedAt
                  ? dayjs(mapData.updatedAt).format("MMM DD, YYYY")
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm sm:text-base">Tags</p>
            <div className="flex flex-wrap gap-2">
              {mapData.tags && mapData.tags.length > 0 ? (
                mapData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-full inline-block"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-sm sm:text-base text-gray-500 italic">
                  This item has no tags
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapOverview;
