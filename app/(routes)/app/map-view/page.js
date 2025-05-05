"use client";

import MapHeader from "@/app/_components/app/map-view/map-header";
import MapMain from "@/app/_components/app/map-view/map-main";
import MapSidebar from "@/app/_components/app/map-view/map-sidebar";

const MapView = () => {
  return (
    <div className="flex flex-col">
      <MapHeader />
      <div className="flex">
        <MapSidebar />
        <MapMain />
      </div>
    </div>
  );
};

export default MapView;
