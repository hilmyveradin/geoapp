"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ButtonSidebar } from "@/components/ui/button-sidebar";

const MapSidebarRight = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div
      className={cn(
        "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] right-0 bottom-10 z-10 bg-white w-[48px]",
        {
          "w-[180px]": !showSidebar,
        }
      )}
    >
      <ButtonSidebar variant="ghost">
        <img
          className={cn("w-4 h-4")}
          src="/app/style-icon.svg"
          alt="style icon"
        />
        {!showSidebar && <span className="inline-block ml-2">Style</span>}
      </ButtonSidebar>
      <ButtonSidebar
        variant="ghost"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <ChevronRight
          className={cn("w-4 h-4", {
            "-rotate-180": showSidebar,
          })}
        />
        {!showSidebar && <span className="inline-block ml-2">Collapse</span>}
      </ButtonSidebar>
      {/* <div
        className={cn(
          "flex items-center justify-center absolute top-12 right-[-20px] w-10 h-10 bg-white p-1 rounded-full transition-all cursor-pointer"
        )}
        onClick={() => setShowSidebar((prev) => !prev)}
      > */}
      {/* <ChevronRight
          className={cn("w-6 h-6 transition-all duration-200", {
            "-rotate-180": showSidebar,
          })}
        /> */}
      {/* </div> */}
      {/* <Tabs defaultValue="layers" className="w-full mt-2">
        <TabsList className="flex justify-between w-full">
          <TabsTrigger value="layers" className="w-1/2">
            Layers
          </TabsTrigger>
          <TabsTrigger value="legend" className="w-1/2">
            Legend
          </TabsTrigger>
        </TabsList>
        <LayersContent />
        <LegendContent />
      </Tabs> */}
    </div>
  );
};

export default MapSidebarRight;
