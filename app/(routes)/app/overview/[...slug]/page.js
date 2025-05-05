"use client";

import UserAvatar from "@/app/_components/app/shared/user-avatar";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { UserRound } from "lucide-react";
import { Map } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MapOverview = ({ params }) => {
  const [overviewData, setOverviewData] = useState(null);
  const overviewType = params.slug[0];
  const overviewUid = params.slug[1];
  const router = useRouter();

  useEffect(() => {
    async function loadLayerData() {
      try {
        const response = await fetch(
          `/api/get-layer-id?layerUid=${overviewUid}`,
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
            tags: data.layerTags,
            imageUrl: `http://dev3.webgis.co.id/be/cms/layer/thumbnail/${data.thumbnailUrl}`,
          };
        });
        setOverviewData(modifiedDatas[0]);
      } catch (error) {
        console.log(error);
      }
    }

    async function loadMapData() {
      try {
        const response = await fetch(`/api/get-map-id?mapUid=${overviewUid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const datas = await response.json();
        const modifiedDatas = datas.data;
        modifiedDatas[
          "imageUrl"
        ] = `http://dev3.webgis.co.id/be/cms/layer/thumbnail/${modifiedDatas.thumbnailUrl}`;
        setOverviewData(modifiedDatas);
      } catch (error) {
        console.log(error);
      }
    }

    if (overviewType === "layer") {
      loadLayerData();
    } else {
      loadMapData();
    }
  }, [overviewUid, overviewType]);

  const handleOpenMapViewer = () => {
    router.push(`/app/map-view/${overviewUid}`);
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

  console.log(overviewData);

  if (!overviewData) return <div>Loading...</div>;

  return (
    <div className="flex w-full h-full gap-16 p-10 bg-blue-100">
      <img
        src={overviewData.imageUrl}
        alt="map image"
        className="w-3/4 max-h-full"
      />
      <div className="flex flex-col !w-1/4 gap-12">
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
            <UserAvatar user={overviewData.creator} />
            <p>{overviewData.creator.fullName}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p> Date</p>
          <div className="flex items-center justify-between">
            <p>Item created</p>
            <p>{dayjs(overviewData.createdAt).format("MMM, DD, YYYY")}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Item updated</p>
            {overviewData.updatedAt ? (
              <p>{dayjs(overviewData.updatedAt).format("MMM, DD, YYYY")}</p>
            ) : (
              <p>-</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p>Tags</p>
          <div className="flex items-center justify-between">
            {overviewData.tags ? (
              <p>{overviewData.tags}</p>
            ) : (
              <p>This items has no tags</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapOverview;
