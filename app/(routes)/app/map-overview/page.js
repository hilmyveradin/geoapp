"use client";

import UserAvatar from "@/app/_components/app/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { Map } from "lucide-react";

const MapOverview = () => {
  const handleOpenMapViewer = () => {};

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

  const mockUser = {
    fullName: "Foobar",
    avatar: null,
  };
  return (
    <div className="flex w-full h-full gap-16 p-10 bg-blue-100">
      <img
        src="https://github.com/shadcn.png"
        alt="map image"
        className="w-full max-h-full"
      ></img>
      <div className="flex flex-col w-1/4 gap-12">
        <div className="flex flex-col gap-6">
          {BUTTON_CONSTANTS.map((item) => (
            <Button
              onclick={item.action}
              key={`button-${item.title}`}
              className="w-full gap-4 bg-green-500"
            >
              {item.title}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Map className="w-7 h-7" />
          <p>Map</p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between space-x-2 ">
            <p>Owner</p>
            <button
              className="flex items-center space-x-2 text-green-500 stroke-green-500"
              onClick={handleChangeOwner}
            >
              <UserRound className="w-7 h-7" />
              <p>Change owner</p>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <UserAvatar user={mockUser} />
            <p>Admin</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p> Date</p>
          <div className="flex items-center justify-between">
            <p>Item created</p>
            <p>Des 07 2023</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Item created</p>
            <p>Des 07 2023</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p>Tags</p>
          <div className="flex items-center justify-between">
            <p>This items has no tags</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapOverview;
