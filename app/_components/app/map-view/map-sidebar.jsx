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
import PaginationLayerTable from "../layer-table/pagination-layer-table";
import { Textarea } from "@/components/ui/textarea";
import TooltipText from "@/app/_components/shared/tooltip-text";
import SaveAlertDialog from "../shared/save-alert-dialog";
import { X } from "lucide-react";
import ShareDialog from "../shared/share-dialog";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import useTableQueryStore from "@/helpers/hooks/store/use-table-query-store";
import useMapSidebarStore from "@/helpers/hooks/store/use-map-sidebar-store";
import BaseMapContent from "./map-sidebar/basemap-content";
import { Earth } from "lucide-react";
import useUserStore from "@/helpers/hooks/store/use-user-store";

const MapSidebar = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const {
    tableLoaded,
    setTableLoaded,
    mapData,
    layerInfo,
    setMapClicked,
    setHighlightedLayer,
  } = useMapViewStore();

  const {
    ftsQuery,
    setFtsQuery,
    reloadTable,
    setReloadTable,
    setSearchSubmit,
  } = useTableQueryStore();

  const {
    showRightSidebar,
    expandedRightSidebarContent,
    setShowLeftSidebar,
    showLeftSidebar,
    expandedLeftSidebarContent,
    setExpandedLeftSidebarContent,
  } = useMapSidebarStore();

  const { isAdmin, isEditor } = useUserStore();

  const handleFtsQuery = (e) => {
    // Destructure the name and value from
    // the changed element
    const { name, value } = e.target;
    if (value === "") {
      setSearchSubmit(false);
    }
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
    // basemap: <BaseMapContent />,
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
    if (selectedButton == buttonName) {
      setExpandedLeftSidebarContent(false);
    } else {
      setExpandedLeftSidebarContent(true);
    }
  };

  return (
    <div className="">
      <div
        className={cn(
          "flex flex-col fixed top-[58px] h-[calc(100vh-58px)] left-0 bottom-10 z-50 bg-nileBlue-900 w-12 text-white text-xs p-1",
          {
            "w-[160px]": showLeftSidebar,
          }
        )}
      >
        {mapData.mapType === "map" && (isAdmin || isEditor) && (
          <TooltipText content="Add Layer" side="right" align="start">
            <Button
              variant="ghost"
              onClick={() => handleButtonClick("addLayer")}
              className={cn("flex justify-start text-blackHaze-500", {
                "text-white bg-nileBlue-700": selectedButton === "addLayer",
                "p-0 justify-center": !showLeftSidebar,
              })}
            >
              <PlusCircle
                className={cn("w-4 h-4 stroke-blackHaze-500", {
                  "stroke-white stroke-2": selectedButton === "addLayer",
                })}
              />
              {showLeftSidebar && (
                <span className="inline-block ml-2">Add Layer</span>
              )}
            </Button>
          </TooltipText>
        )}

        <TooltipText content="Layers" side="right" align="start">
          <Button
            variant="ghost"
            onClick={() => handleButtonClick("layers")}
            className={cn("flex justify-start text-blackHaze-500", {
              "text-white bg-nileBlue-700": selectedButton === "layers",
              "p-0 justify-center": !showLeftSidebar,
            })}
          >
            <Layers3
              className={cn("w-4 h-4 stroke-blackHaze-500", {
                "stroke-white stroke-2": selectedButton === "layers",
              })}
            />
            {showLeftSidebar && (
              <span className="inline-block ml-2">Layers</span>
            )}
          </Button>
        </TooltipText>

        {/* <TooltipText content="Basemap" side="right" align="start">
          <Button
            variant="ghost"
            onClick={() => handleButtonClick("basemap")}
            className={cn("flex justify-start text-blackHaze-500", {
              "text-white bg-nileBlue-700": selectedButton === "basemap",
              "p-0 justify-center": !showLeftSidebar,
            })}
          >
            <Earth
              className={cn("w-4 h-4 stroke-blackHaze-500", {
                "stroke-white stroke-2": selectedButton === "basemap",
              })}
            />
            {showLeftSidebar && (
              <span className="inline-block ml-2">Basemap</span>
            )}
          </Button>
        </TooltipText> */}

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
          {!showLeftSidebar && <span className="inline-block ml-2">Tables</span>}
        </Button> */}

        {/* {(isAdmin || isEditor) && <Separator className="my-2" />} */}

        {/* {(isAdmin || isEditor) && (
          <SaveAlertDialog>
            <Button
              variant="ghost"
              className={cn("flex justify-start text-blackHaze-500", {
                "p-0 justify-center": !showLeftSidebar,
              })}
            >
              <Save className={cn("w-4 h-4 stroke-blackHaze-500", {})} />
              {showLeftSidebar && (
                <span className="inline-block ml-2">Save</span>
              )}
            </Button>
          </SaveAlertDialog>
        )} */}

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
                {!showLeftSidebar && (
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

        {/* <Separator className="my-2" /> */}

        {/* <ShareDialog>
          <Button
            variant="ghost"
            className={cn("flex justify-start text-blackHaze-500", {
              "p-0 justify-center": !showLeftSidebar,
            })}
          >
            <Share2
              className={cn("w-4 h-4 stroke-blackHaze-500 transition-all", {})}
            />
            {showLeftSidebar && (
              <span className="inline-block ml-2">Share</span>
            )}
          </Button>
        </ShareDialog> */}
        {/* Additional empty div for spacing, pushing the Collapse button to the bottom */}
        <div className="flex-grow" />

        <Button
          variant="ghost"
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          className={cn("flex justify-start text-blackHaze-500", {
            "p-0 justify-center": !showLeftSidebar,
          })}
        >
          <ChevronLeft
            className={cn("w-4 h-4 stroke-blackHaze-500 transition-all", {
              "rotate-0": showLeftSidebar,
              "rotate-180": !showLeftSidebar,
            })}
          />
          {showLeftSidebar && (
            <span className="inline-block ml-2">Collapse</span>
          )}
        </Button>
      </div>
      {(selectedButton === "addLayer" ||
        selectedButton === "layers" ||
        selectedButton === "basemap") && (
        <div
          className={cn(
            "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] bottom-10 z-10 bg-blackHaze-50",
            {
              "left-12 w-60": !showLeftSidebar,
              "left-40 w-60": showLeftSidebar,
            }
          )}
        >
          {BUTTON_CONTENT[selectedButton]}
        </div>
      )}
      {/* Cara baca logic di bawah: */}
      {/* Ada 4 bool: showLeftSidebar, expandedLeftSidebarContent, showRightSidebar, expandedRightSidebarContent */}
      {/* Value default awal false semua */}
      {/* Saat sidebar atau right sidebar bertambah panjang, salah satu bool ini jadi true */}
      {/* Maka perlu dicek variabel yang true aja */}
      {/* Terus, buat masing-masing style, dimulai kalau yg true cuman 1 bool */}
      {/* Kalau lebih, dicek ke 2 bool, 3 bool, hingga terakhir 4 bool */}
      {tableLoaded && (
        <div
          className={cn(
            "fixed rounded-md top-[58vh] h-[calc(100vh-60vh-24px)] pb-8 z-10 left-[60px] w-[calc(100vw-60px-60px)]",
            {
              "left-[172px] w-[calc(100vw-172px-60px)]": showLeftSidebar,
              "left-[60px] w-[calc(100vw-60px-124px)]": showRightSidebar,
              "left-[300px] w-[calc(100vw-300px-60px)]":
                expandedLeftSidebarContent,
              "left-[60px] w-[calc(100vw-60px-300px)]":
                expandedRightSidebarContent,

              "left-[412px] w-[calc(100vw-412px-60px)]":
                showLeftSidebar && expandedLeftSidebarContent,
              "left-[172px] w-[calc(100vw-172px-124px)]":
                showLeftSidebar && showRightSidebar,
              "left-[172px] w-[calc(100vw-172px-300px)]":
                showLeftSidebar && expandedRightSidebarContent,

              "left-[300px] w-[calc(100vw-300px-124px)]":
                showRightSidebar && expandedLeftSidebarContent,
              "left-[60px] w-[calc(100vw-60px-364px)]":
                showRightSidebar && expandedRightSidebarContent,

              "left-[300px] w-[calc(100vw-240px-364px)]":
                expandedLeftSidebarContent && expandedRightSidebarContent,

              "left-[412px] w-[calc(100vw-412px-124px)]":
                showLeftSidebar &&
                showRightSidebar &&
                expandedLeftSidebarContent,
              "left-[172px] w-[calc(100vw-172px-364px)]":
                showLeftSidebar &&
                showRightSidebar &&
                expandedRightSidebarContent,
              "left-[412px] w-[calc(100vw-412px-300px)]":
                showLeftSidebar &&
                expandedLeftSidebarContent &&
                expandedRightSidebarContent,

              "left-[300px] w-[calc(100vw-300px-364px)]":
                showRightSidebar &&
                expandedLeftSidebarContent &&
                expandedRightSidebarContent,

              "left-[412px] w-[calc(100vw-416px-364px)]":
                showLeftSidebar &&
                expandedLeftSidebarContent &&
                showRightSidebar &&
                expandedRightSidebarContent,
            }
          )}
        >
          <div className="flex items-center justify-between pl-4 bg-white">
            <div className="w-1/2 pr-4">
              <TooltipText
                content={layerInfo.layerTitle}
                side="top"
                align="start"
              >
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
                setHighlightedLayer(null);
                setSearchSubmit(false);
              }}
            >
              <X />
            </Button>
          </div>
          {reloadTable && <PaginationLayerTable />}
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
