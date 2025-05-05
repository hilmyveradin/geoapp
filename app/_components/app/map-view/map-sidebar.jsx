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
import { useState } from "react";
import LayersContent from "./map-sidebar/layers-content";
import { Button } from "@/components/ui/button";
import AddLayersContent from "./map-sidebar/add-layer-content";
import { Separator } from "@/components/ui/separator";
import PaginationLayerTable from "../layer-table/PaginationLayerTable";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import SaveAlertDialog from "../shared/save-alert-dialog";

const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedSidebarButtons, setExpandedSidebarButtons] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [showSidebarRight, setShowSidebarRight] = useState(true);
  const { tableLoaded, mapData } = useMapViewStore();

  // Define content for each button
  const BUTTON_CONTENT = {
    addLayer: <AddLayersContent />,
    layers: <LayersContent />,
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
    if (selectedButton == buttonName) {
      setExpandedSidebarButtons(true);
    } else {
      setExpandedSidebarButtons(false);
    }
  };

  return (
    <div className="">
      <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] left-0 bottom-10 z-10 bg-gableGreen-500 w-[48px] text-white text-xs",
          {
            "w-[160px]": !showSidebar,
          }
        )}
      >
        {mapData.mapType === "map" && (
          <Button
            variant="ghost"
            onClick={() => handleButtonClick("addLayer")}
            className={cn("flex justify-start text-blackHaze-500", {
              "text-white": selectedButton === "addLayer",
            })}
          >
            <PlusCircle
              className={cn("w-4 h-4 stroke-blackHaze-500", {
                "stroke-white stroke-2": selectedButton === "addLayer",
              })}
            />
            {!showSidebar && (
              <span className="inline-block ml-2">Add Layer</span>
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => handleButtonClick("layers")}
          className={cn("flex justify-start text-blackHaze-500", {
            "text-white": selectedButton === "layers",
          })}
        >
          <Layers3
            className={cn("w-4 h-4 stroke-blackHaze-500", {
              "stroke-white stroke-2": selectedButton === "layers",
            })}
          />
          {!showSidebar && <span className="inline-block ml-2">Layers</span>}
        </Button>

        {/* <Button
          variant="ghost"
          onClick={() => console.log("Tables click")}
          className={cn("flex justify-start text-blackHaze-500", {
            "text-white": selectedButton === "tables",
          })}
        >
          <Sheet
            className={cn("w-4 h-4 stroke-blackHaze-500", {
              "stroke-white stroke-2": selectedButton === "tables",
            })}
          />
          {!showSidebar && <span className="inline-block ml-2">Tables</span>}
        </Button> */}

        <Separator className="my-2" />

        <SaveAlertDialog>
          <Button
            variant="ghost"
            className={cn("flex justify-start text-blackHaze-500", {
              // "text-white": selectedButton === "save",
            })}
          >
            <Save
              className={cn("w-4 h-4 stroke-blackHaze-500", {
                // "stroke-white stroke-2": selectedButton === "save",
              })}
            />
            {!showSidebar && <span className="inline-block ml-2">Save</span>}
          </Button>
        </SaveAlertDialog>

        {/* <Menubar className="bg-transparent border-none">
          <MenubarMenu>
            <MenubarTrigger
              asChild
              className="data-[state=active]:text-white data-[state=active]:stroke-white data-[state=active]:stroke-2"
            >
              <Button
                variant="ghost"
                className={cn("flex justify-start text-blackHaze-500", {
                  // "text-white": selectedButton === "save",
                })}
              >
                <Save
                  className={cn("w-4 h-4 stroke-blackHaze-500", {
                    // "stroke-white stroke-2": selectedButton === "save",
                  })}
                />
                {!showSidebar && (
                  <span className="inline-block ml-2">Save</span>
                )}
              </Button>
            </MenubarTrigger>
            <MenubarContent side="right">
              <MenubarItem>Save</MenubarItem>
              <MenubarItem>Save as</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar> */}

        {/* TODO: Uncomment this if share is ready <Button
          variant="ghost"
          onClick={() => console.log("Share click")}
          className={cn("flex justify-start text-blackHaze-500", {
            "text-white": selectedButton === "share",
          })}
        >
          <Share2
            className={cn("w-4 h-4 stroke-blackHaze-500", {
              "stroke-white stroke-2": selectedButton === "share",
            })}
          />
          {!showSidebar && <span className="inline-block ml-2">Share</span>}
        </Button> */}

        <Separator className="my-2" />

        {/* Additional empty div for spacing, pushing the Collapse button to the bottom */}
        <div className="flex-grow" />

        <Button
          variant="ghost"
          onClick={() => setShowSidebar((prev) => !prev)}
          className={cn("flex justify-start text-blackHaze-500")}
        >
          <ChevronLeft
            className={cn("w-4 h-4 stroke-blackHaze-500  transition-all", {
              "rotate-0": !showSidebar,
              "rotate-180": showSidebar,
            })}
          />
          {!showSidebar && <span className="inline-block ml-2">Collapse</span>}
        </Button>
      </div>
      {(selectedButton === "addLayer" || selectedButton === "layers") && (
        <div
          className={cn(
            "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] bottom-10 z-10 bg-blackHaze-50",
            {
              "left-12 w-60": showSidebar,
              "left-40 w-60": !showSidebar,
            }
          )}
        >
          {BUTTON_CONTENT[selectedButton]}
        </div>
      )}
      {/* TODO: Fix this grid views and remove the 48px if there's already a style sidebar */}
      <div
        className={cn(
          "fixed rounded-md top-[60vh] h-[calc(100vh-60vh-24px)] pb-5 z-10",
          {
            "left-[300px] w-[calc(100vw-300px-60px+48px)]":
              !expandedSidebarButtons && showSidebar,
            "left-[172px] w-[calc(100vw-172px-60px+48px)]":
              expandedSidebarButtons && !showSidebar,
            "left-[412px] w-[calc(100vw-412px-60px+48px)]":
              !expandedSidebarButtons && !showSidebar,
            "left-[60px] w-[calc(100vw-60px-60px+48px)]":
              expandedSidebarButtons && showSidebar && showSidebarRight,
            "left-[60px] w-[calc(100vw-60px-192px+48px)]":
              expandedSidebarButtons && showSidebar && !showSidebarRight,
          }
        )}
      >
        {tableLoaded && <PaginationLayerTable />}
      </div>
      {/* TODO: Add this sidebar div <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] right-0 bottom-10 z-10 bg-white w-[48px]",
          {
            "w-[180px]": !showSidebarRight,
          }
        )}
      >
        <ButtonSidebar variant="ghostLeft">
          <Image
            className={cn("w-4 h-4")}
            src="/app/style-icon.svg"
            alt="style icon"
            width={16}
            height={16}
          />
          {!showSidebarRight && (
            <span className="inline-block ml-2">Style</span>
          )}
        </ButtonSidebar>
        <ButtonSidebar
          variant="ghostLeft"
          onClick={() => setShowSidebarRight((prev) => !prev)}
        >
          <ChevronRight
            className={cn("w-4 h-4", {
              "-rotate-180": showSidebarRight,
            })}
          />
          {!showSidebarRight && (
            <span className="inline-block ml-2">Collapse</span>
          )}
        </ButtonSidebar>
      </div> */}
    </div>
  );
};

export default MapSidebar;
