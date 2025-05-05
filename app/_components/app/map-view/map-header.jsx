"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserAvatar from "../shared/user-avatar";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";

const MapHeader = () => {
  const { mapData, setMapData, setMapLayers } = useMapViewStore();
  const { data: session } = useSession();

  const resetData = () => {
    setMapLayers(null);
    setMapData(null);
  };
  return (
    <div className="flex items-center justify-between w-full bg-white border shadow-xl h-14">
      <Label className="pl-12 text-base font-medium">{`${mapData.mapTitle}`}</Label>
      <div className="flex items-center">
        <div className="pr-2">
          <Link href="/app/maps">
            <Button
              variant="ghost"
              className="text-base font-medium"
              onClick={resetData}
            >
              Maps
            </Button>
          </Link>
          <Link href="/app/layers">
            <Button
              variant="ghost"
              className="text-base font-medium"
              onClick={resetData}
            >
              Layers
            </Button>
          </Link>
          {/* <Link href="/app/users"> //TODO: Uncomment this if Users and Group Features is done
            <Button variant="ghost" className="text-lg font-medium">
              Users
            </Button>
          </Link>
          <Link href="/app/groups">
            <Button variant="ghost" className="text-lg font-medium">
              Groups
            </Button>
          </Link> */}
        </div>
        <div className="pl-4 pr-2.5">
          <UserAvatar user={session.user} className="w-8 h-8 text-xs" />
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
