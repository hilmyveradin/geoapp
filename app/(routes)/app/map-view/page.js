"use client";

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
      <div className="flex items-center justify-center w-screen h-screen">
        <MapSidebar />
        <MapMain />
      </div>
      w
    </div>
  );
};

export default MapView;
