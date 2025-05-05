"use client";

import UserAvatar from "@/app/_components/app/shared/user-avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Loader2, UserRound, Map } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MapOverview = ({ params }) => {
  const [overviewData, setOverviewData] = useState(null);
  const overviewType = params.slug[0];
  const overviewUid = params.slug[1];
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const endpoint =
          overviewType === "layer"
            ? `${process.env.NEXT_PUBLIC_BASE_PATH}/api/layers/get-layer-id?layerUid=${overviewUid}`
            : `${process.env.NEXT_PUBLIC_BASE_PATH}/api/maps/get-map-id?mapUid=${overviewUid}`;

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
                imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/be/cms/layer/thumbnail/${data.data[0].thumbnailUrl}`,
              }
            : {
                ...data.data,
                imageUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/be/cms/layer/thumbnail/${data.data.thumbnailUrl}`,
              };

        setOverviewData(modifiedData);
      } catch (error) {
        console.error("Error loading data:", error);
        // Consider adding error state and displaying to user
      }
    }

    loadData();
  }, [overviewUid, overviewType]);

  const BUTTON_CONSTANTS = [
    {
      title: "Open in Map Viewer",
      action: () => router.push(`/app/map-view/${overviewType}/${overviewUid}`),
    },
    { title: "Share", action: () => {} },
    { title: "Metadata", action: () => {} },
    { title: "Edit Thumbnail", action: () => {} },
  ];

  if (!overviewData) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <h1 className="flex items-center px-4 text-xl sm:text-2xl font-bold text-white border shadow-xl text-start bg-nileBlue-600 h-14 rounded-lg">
        {overviewData[overviewType === "layer" ? "layerTitle" : "mapTitle"]}
      </h1>
      <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10">
        <div className="w-full md:w-2/3">
          <AspectRatio ratio={450 / 200}>
            <img
              src={overviewData.imageUrl}
              alt="Map overview"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col gap-8 w-full md:w-1/3 min-w-[288px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {BUTTON_CONSTANTS.map((item) => (
              <Button
                onClick={item.action}
                key={`button-${item.title}`}
                className="w-full"
              >
                {item.title}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Map className="w-6 h-6 sm:w-7 sm:h-7" />
            <p className="text-sm sm:text-base">Feature Layer</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-sm sm:text-base">Owner</p>
              <button
                className="flex items-center space-x-2 text-gableGreen-500 stroke-gableGreen-500"
                onClick={() => {}}
              >
                <UserRound className="w-5 h-5" />
                <span className="text-sm sm:text-base">Change owner</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <UserAvatar user={overviewData.creator} />
              <p className="text-sm sm:text-base">
                {overviewData.creator.fullName}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm sm:text-base">Date</p>
            <div className="flex justify-between">
              <p className="text-sm sm:text-base">Item created</p>
              <p className="text-sm sm:text-base">
                {dayjs(overviewData.createdAt).format("MMM DD, YYYY")}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm sm:text-base">Item updated</p>
              <p className="text-sm sm:text-base">
                {overviewData.updatedAt
                  ? dayjs(overviewData.updatedAt).format("MMM DD, YYYY")
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm sm:text-base">Tags</p>
            <p className="text-sm sm:text-base">
              {overviewData.tags || "This item has no tags"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapOverview;
