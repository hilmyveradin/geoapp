"use client";

import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  PlusCircle,
  Layers3,
  Sheet,
  Save,
  Share2,
} from "lucide-react";
import { Fragment, useState } from "react";
import LayersContent from "./map-sidebar/layers-content";
import { Button } from "@/components/ui/button";
import AddLayerContent from "./map-sidebar/add-layer-content";
import LegendsContent from "./map-sidebar/legends-content";
import TablesContent from "./map-sidebar/tables-content";
import SaveContent from "./map-sidebar/save-content";
import ShareContent from "./map-sidebar/share-content";
import { Separator } from "@/components/ui/separator";

const MapSidebar = () => {
  debugger;
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);

  // Button data
  const BUTTONS_CONSTANTS = [
    {
      buttonKey: "addLayer",
      icon: <PlusCircle className={cn("w-4 h-4")} />,
      label: "Add Layer",
      onClick: () => handleButtonClick("addLayer"),
    },
    {
      buttonKey: "layers",
      icon: <Layers3 className={cn("w-4 h-4")} />,
      label: "Layers",
      onClick: () => handleButtonClick("layers"),
    },
    {
      buttonKey: "tables",
      icon: <Sheet className={cn("w-4 h-4")} />,
      label: "Tables",
      onClick: () => handleButtonClick("tables"),
    },
    {
      buttonKey: "save",
      icon: <Save className={cn("w-4 h-4")} />,
      label: "Save",
      onClick: () => handleButtonClick("save"),
    },
    {
      buttonKey: "share",
      icon: <Share2 className={cn("w-4 h-4")} />,
      label: "Share",
      onClick: () => handleButtonClick("share"),
    },
    {
      buttonKey: "collapsible",
      icon: (
        <ChevronLeft
          className={cn("w-4 h-4 transition-transform duration-300", {
            // TODO: Check why this isn't animating
            "rotate-0": !showSidebar,
            "-rotate-180": showSidebar,
          })}
        />
      ),
      label: "Collapse",
      onClick: () => setShowSidebar((prev) => !prev),
    },
  ];

  // Define content for each button
  const BUTTON_CONTENT = {
    addLayer: <AddLayerContent />,
    layers: <LayersContent />,
    legends: <LegendsContent />,
    tables: <TablesContent />,
    save: <SaveContent />,
    share: <ShareContent />,
  };

  // Reusable Button component
  const SidebarButton = ({ buttonKey, icon, label, onClick }) => {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn("flex justify-start !rounded-r-none", {
          "bg-gray-500":
            buttonKey?.toLowerCase() === selectedButton?.toLowerCase(),
        })}
      >
        {icon}
        {!showSidebar && <span className="inline-block ml-2">{label}</span>}
      </Button>
    );
  };

  const handleButtonClick = (buttonName) => {
    debugger;
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] left-0 bottom-10 z-10 bg-gableGreen-500 w-[48px] text-white",
          {
            "w-[160px]": !showSidebar,
          }
        )}
      >
        {/* Render buttons dynamically */}
        {BUTTONS_CONSTANTS.map((data, index) => {
          if (data.buttonKey === "collapsible") {
            return null;
          }

          return (
            <Fragment key={data.buttonKey}>
              <SidebarButton {...data} />

              {/* Insert a separator after certain buttons */}
              {["tables", "share"].includes(data.buttonKey) && (
                <Separator className="my-2" /> // Adjust className as needed
              )}
            </Fragment>
          );
        })}

        {/* Additional empty div for spacing, pushing the Collapse button to the bottom */}
        <div className="flex-grow" />

        {/* Render the Collapse button separately at the bottom */}
        <SidebarButton
          {...BUTTONS_CONSTANTS.find((b) => b.buttonKey === "collapsible")}
        />
      </div>
      {selectedButton && (
        <div
          className={cn(
            "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] bottom-10 z-10 bg-gray-500",
            {
              "left-12 w-fit": showSidebar,
              "left-40 w-fit": !showSidebar,
            }
          )}
        >
          {BUTTON_CONTENT[selectedButton]}
        </div>
      )}
    </div>
  );
};

export default MapSidebar;
