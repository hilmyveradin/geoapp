"use client";

import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  PlusCircle,
  Layers3,
  Sheet,
  Save,
  Share2,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import LayersContent from "./map-sidebar/layers-content";
import { Button } from "@/components/ui/button";
import AddLayersContent from "./map-sidebar/add-layer-content";
import { Separator } from "@/components/ui/separator";
import PaginationLayerTable from "../layer-table/PaginationLayerTable";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import useTableQueryStore from "@/helpers/hooks/store/useTableQueryStore";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import TooltipText from "@/app/_components/shared/tooltipText";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import SaveAlertDialog from "../shared/save-alert-dialog";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import GeojsonCard from "@/app/_components/app/geojson-card/GeojsonCard";

const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedSidebarButtons, setExpandedSidebarButtons] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [showSidebarRight, setShowSidebarRight] = useState(true);
  const { tableLoaded, setTableLoaded, mapData, layerInfo, mapClicked, setMapClicked } = useMapViewStore();
  const {ftsQuery, setFtsQuery, reloadTable, setReloadTable, setSearchSubmit} = useTableQueryStore();

  const handleFtsQuery = (e) => {
    // Destructure the name and value from
    // the changed element
    const { name, value } = e.target;
    setFtsQuery({ ...ftsQuery, value });
  };

  useEffect(() => {
    setTableLoaded(false);
    setReloadTable(false);
    setMapClicked(false);
  }, [setMapClicked, setReloadTable, setTableLoaded]);
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
          "flex flex-col fixed top-14 h-[calc(100vh-56px)] left-0 bottom-10 z-10 bg-nileBlue-900 w-12 text-white text-xs p-1",
          {
            "w-[160px]": showSidebar,
          }
        )}
      >
        {mapData.mapType === "map" && (
          <Button
            variant="ghost"
            onClick={() => handleButtonClick("addLayer")}
            className={cn("flex justify-start text-blackHaze-500", {
              "text-white bg-nileBlue-700": selectedButton === "addLayer",
              "p-0 justify-center": !showSidebar,
            })}
          >
            <PlusCircle
              className={cn("w-4 h-4 stroke-blackHaze-500", {
                "stroke-white stroke-2": selectedButton === "addLayer",
              })}
            />
            {showSidebar && (
              <span className="inline-block ml-2">Add Layer</span>
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => handleButtonClick("layers")}
          className={cn("flex justify-start text-blackHaze-500", {
            "text-white bg-nileBlue-700": selectedButton === "layers",
            "p-0 justify-center": !showSidebar,
          })}
        >
          <Layers3
            className={cn("w-4 h-4 stroke-blackHaze-500", {
              "stroke-white stroke-2": selectedButton === "layers",
            })}
          />
          {showSidebar && <span className="inline-block ml-2">Layers</span>}
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
              "p-0 justify-center": !showSidebar,
            })}
          >
            <Save
              className={cn("w-4 h-4 stroke-blackHaze-500", {
                // "stroke-white stroke-2": selectedButton === "save",
              })}
            />
            {showSidebar && <span className="inline-block ml-2">Save</span>}
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
          className={cn("flex justify-start text-blackHaze-500", {
            "p-0 justify-center": !showSidebar,
          })}
        >
          <ChevronLeft
            className={cn("w-4 h-4 stroke-blackHaze-500 transition-all", {
              "rotate-0": showSidebar,
              "rotate-180": !showSidebar,
            })}
          />
          {showSidebar && <span className="inline-block ml-2">Collapse</span>}
        </Button>
      </div>
      {(selectedButton === "addLayer" || selectedButton === "layers") && (
        <div
          className={cn(
            "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] bottom-10 z-10 bg-blackHaze-50",
            {
              "left-12 w-60": !showSidebar,
              "left-40 w-60": showSidebar,
            }
          )}
        >
          {BUTTON_CONTENT[selectedButton]}
        </div>
      )}
      {tableLoaded && (
        <div
          className={cn(
            "fixed rounded-md top-[58vh] h-[calc(100vh-60vh-24px)] pb-8 z-10",
            {
              "left-[300px] w-[calc(100vw-300px-60px)]":
                !expandedSidebarButtons && !showSidebar,
              "left-[172px] w-[calc(100vw-172px-60px)]":
                expandedSidebarButtons && showSidebar,
              "left-[412px] w-[calc(100vw-412px-60px)]":
                !expandedSidebarButtons && showSidebar,
              "left-[60px] w-[calc(100vw-60px-60px)]":
                expandedSidebarButtons && !showSidebar && showSidebarRight,
              "left-[60px] w-[calc(100vw-60px-192px)]":
                expandedSidebarButtons && !showSidebar && !showSidebarRight,
            }
          )}
        >
          <div className="flex items-center justify-between pl-4 bg-white">
            <div className="w-1/2 pr-4">
              <TooltipText content={layerInfo.layerTitle} side="top" align="start">
                <p className="text-base font-bold truncate cursor-pointer">
                  {layerInfo.layerTitle}
                </p>
              </TooltipText>
            </div>
            <Textarea 
              placeholder="Put search query here..."
              className="h-[40px] m-[4px]"
              onChange={handleFtsQuery}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReloadTable(false);
                setTimeout(() => {
                  setSearchSubmit(true);
                  setReloadTable(true);
                }, 100);
              }}
            >
              <Search />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTableLoaded(false);
                setReloadTable(false);
              }}
            >
              <X />
            </Button>
          </div>
          {reloadTable && <PaginationLayerTable />}
        </div>
      )}
      {mapClicked && (
        <div
          className={cn(
            "fixed z-10 top-[68px]",
            {
              "left-[300px]":
                !expandedSidebarButtons && !showSidebar,
              "left-[172px]":
                expandedSidebarButtons && showSidebar,
              "left-[412px]":
                !expandedSidebarButtons && showSidebar,
              "left-[61px]":
                expandedSidebarButtons && !showSidebar,
            }
          )}
        >
          <GeojsonCard/>
        </div>
      )}
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
