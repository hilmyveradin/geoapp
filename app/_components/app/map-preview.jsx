"use client";

import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import { MapPin } from "lucide-react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import UserAvatar from "./shared/user-avatar";
import { useRouter } from "next/navigation";

const MapPreview = () => {
  const [currentTab, setCurrentTab] = useState("Overview");

  const handleCurrentTab = (tab) => {
    setCurrentTab(tab);
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <PreviewHeader hanldeCurrentTab={handleCurrentTab} />
      <PreviewBody currentTab={currentTab} />
    </div>
  );
};

export default MapPreview;

const PreviewHeader = (props) => {
  const { hanldeCurrentTab } = props;
  const renameAction = () => {};
  const data = "";
  return (
    <div className="flex items-center justify-between w-full h-16 px-12 text-white bg-green-500">
      <div className="flex items-center justify-center space-x-2">
        <p className="font-bold">your data name</p>
        <Pencil className="w-8 h-8" onClick={renameAction} />
      </div>
      <div className="flex space-x-4">
        <Button onClick={hanldeCurrentTab("Overview")}>Overview</Button>
        <Button onClick={hanldeCurrentTab("Data")}>Data</Button>
      </div>
    </div>
  );
};

const PreviewBody = (props) => {
  const { currentTab } = props;

  if (currentTab === "Overview") {
    return (
      <div className="w-full h-full p-12">
        <OverviewBody />
      </div>
    );
  } else {
    return (
      <div className="w-full h-full p-12">
        <DataBody />
      </div>
    );
  }
};

const OverviewBody = (props) => {
  const { bodyTypeTitle } = props;
  const data = "";
  const router = useRouter();
  const openMapViewerAction = () => {
    router.push(`/map-view/${data.layer_uid}`);
  };

  const shareAction = () => {};

  const metadataAction = () => {};

  const editThumbnailAction = () => {};

  const buttons = [
    { title: "Open in Map Viewer", action: openMapViewerAction },
    { title: "Share", action: shareAction },
    { title: "Metadata", action: metadataAction },
    { title: "Edit thumbnail", action: editThumbnailAction },
  ];
  return (
    <div className="flex space-x-12">
      <img src="" alt="" className="w-full h-full" />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-7">
          {buttons.map((item, index) => {
            <Button key={`overview-button-${index}`} onClick={item.action}>
              {item.title}
            </Button>;
          })}
        </div>
        <div className="flex space-x-3">
          <MapPin className="w-6 h-6" />
          <p> {bodyTypeTitle}</p>
        </div>
        <div>
          <div className="flex justify-between">
            <p>Owner</p>
            <button className="flex space-x-2">
              <PersonIcon className="w-6 h-6" />
              <p>Change Owner</p>
            </button>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <UserAvatar user={user} />
            <p>{User.fullName}</p>
          </div>
        </div>
        <div className="flex flex-col gap-7">
          <div className="flex justify-between">
            <p>Item created</p>
            <p>foobar</p>
          </div>
          <div className="flex justify-between">
            <p>Item updated</p>
            <p>foobar 2</p>
          </div>
        </div>
        <div className="flex flex-col">
          <p>Tags</p>
          {data.layer_tags ? (
            <div>
              <p>{data.layer_tags}</p>
            </div>
          ) : (
            <p>This item has no tags</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DataBody = () => {
  return <div>Data body</div>;
};
