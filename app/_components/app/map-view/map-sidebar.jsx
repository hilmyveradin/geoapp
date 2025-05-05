"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, PlusCircle, Layers3, Sheet, Save, Share2, Printer } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LegendContent from "./map-sidebar/legend-content";
import LayersContent from "./map-sidebar/layers-content";
import { ButtonSidebar } from "@/components/ui/button-sidebar";

const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div
      className={cn(
        "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] left-0 bottom-10 z-10 bg-gn-400 w-[48px]",
        {
          "w-[180px]": !showSidebar,
        },
      )}
    >
        <ButtonSidebar variant="ghost">
          <PlusCircle
            className={cn("w-4 h-4")}
          />
          {!showSidebar && <span className="ml-2 inline-block">Add layers</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost">
          <Layers3
            className={cn("w-4 h-4")}
          />
          {!showSidebar && <span className="ml-2 inline-block">Layers</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost">
          <img
            className={cn("w-4 h-4")}
            src="/app/basemap-svgrepo-com.svg"
            alt="basemap icon"
          />
          {!showSidebar && <span className="ml-2 inline-block">Basemap</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost">
          <Sheet
            className={cn("w-4 h-4")}
          />
          {!showSidebar && <span className="ml-2 inline-block">Tables</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost">
          <Save
            className={cn("w-4 h-4")}
          />
          {!showSidebar && <span className="ml-2 inline-block">Save</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost">
          <Share2
            className={cn("w-4 h-4")}
          />
          {!showSidebar && <span className="ml-2 inline-block">Share</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost">
          <Printer
            className={cn("w-4 h-4")}
          />
          {!showSidebar && <span className="ml-2 inline-block">Print</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghost" onClick={() => setShowSidebar((prev) => !prev)}>
          <ChevronLeft
            className={cn("w-4 h-4", {
              "-rotate-180": showSidebar,
            })}
          />
          {!showSidebar && <span className="ml-2 inline-block">Collapse</span>}
        </ButtonSidebar>
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

export default MapSidebar;
