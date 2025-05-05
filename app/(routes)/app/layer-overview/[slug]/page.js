"use client";

import UserAvatar from "@/app/_components/app/shared/user-avatar";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { UserRound } from "lucide-react";
import { Map } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LayerOverview = ({ params }) => {
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

  const handleOpenMapViewer = () => {
    router.push(`/app/map-view/${layerUid}`);
  };

  const handleShareMap = () => {};

  const hanldeMetadata = () => {};

  const handleEditThumbnail = () => {};

  const BUTTON_CONSTANTS = [
    { title: "Open in Map Viewer", action: handleOpenMapViewer },
    { title: "Share", action: handleShareMap },
    { title: "Metadata", action: hanldeMetadata },
    { title: "Edit Thumbnail", action: handleEditThumbnail },
  ];

  const handleChangeOwner = () => {};

  if (!layerData) return <div>Loading...</div>;

  return (
    <div className="flex w-full h-full gap-16 p-10 bg-blue-100">
      <img
        src="https://github.com/shadcn.png"
        alt="map image"
        className="w-full max-h-full"
      />
      <div className="flex flex-col w-1/4 gap-12">
        <div className="flex flex-col gap-6">
          {BUTTON_CONSTANTS.map((item) => (
            <Button
              onClick={item.action}
              key={`button-${item.title}`}
              className="w-full gap-4 bg-gn-500"
            >
              {item.title}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Map className="w-7 h-7" />
          <p>Feature Layer</p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between space-x-2 ">
            <p>Owner</p>
            <button
              className="flex items-center space-x-2 text-gn-500 stroke-gn-500"
              onClick={handleChangeOwner}
            >
              <UserRound className="w-7 h-7" />
              <p>Change owner</p>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <UserAvatar user={layerData.creator} />
            <p>{layerData.creator.fullName}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p> Date</p>
          <div className="flex items-center justify-between">
            <p>Item created</p>
            <p>{dayjs(layerData.createdAt).format("MMM, DD, YYYY")}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Item updated</p>
            {layerData.updatedAt ? (
              <p>{dayjs(layerData.updatedAt).format("MMM, DD, YYYY")}</p>
            ) : (
              <p>-</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p>Tags</p>
          <div className="flex items-center justify-between">
            {layerData.layerTags ? (
              <p>{layerData.layerTags}</p>
            ) : (
              <p>This items has no tags</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerOverview;
