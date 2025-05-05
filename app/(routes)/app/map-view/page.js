"use client";

import AppHeader from "@/app/_components/app/shared/header";
import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main";
import MapSidebar from "@/app/_components/app/map-view/map-sidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MapView = () => {
  const pathName = usePathname();

  useEffect(() => {
    const pathNames = pathName.split("/");
    const layerId = pathNames.slice(-1);
  }, [pathName]);

  return (
    <div className="flex flex-col">
      <MapHeader />
      <div className="flex items-center justify-center">
        <MapSidebar />
        <div className="w-screen h-screen">
          <MapMain />
        </div>
      </div>
    </div>
  );
};

export default MapView;
