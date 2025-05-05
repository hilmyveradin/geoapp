"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div
      className={cn(
        "fixed relatvie top-[136px] h-[calc(100vh-128px)] left-0 bottom-10 z-10 bg-white w-[360px] transition-all rounded-r-lg px-1",
        {
          "left-[-340px]": !showSidebar,
        }
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center absolute top-12 right-[-20px] w-10 h-10 bg-white p-1 rounded-full transition-all cursor-pointer"
        )}
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <ChevronRight
          className={cn("w-6 h-6 transition-all duration-200", {
            "-rotate-180": showSidebar,
          })}
        />
      </div>
      <Tabs defaultValue="layers" className="w-full mt-2">
        <TabsList className="flex justify-between w-full">
          <TabsTrigger value="layers" className="w-1/2">
            Layers
          </TabsTrigger>
          <TabsTrigger value="legend" className="w-1/2">
            Legend
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layers">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="legend">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default MapSidebar;
