"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Layers3,
  Sheet,
  Save,
  Share2,
  List,
} from "lucide-react";
import { Fragment, useState } from "react";
import LayersContent from "./map-sidebar/layers-content";
import { Button } from "@/components/ui/button";
import AddLayersContent from "./map-sidebar/add-layer-content";
import TablesContent from "./map-sidebar/tables-content";
import SaveContent from "./map-sidebar/save-content";
import ShareContent from "./map-sidebar/share-content";
import { Separator } from "@/components/ui/separator";
import { DataTableDemo } from "../layer-table/layer-table";
import { ButtonSidebar } from "@/components/ui/button-sidebar";
import { GridExample } from "@/app/_components/app/layer-table/ag-grid-react";
import DemoPaginationTable from "../layer-table/dummydata";

const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedSidebarButtons, setExpandedSidebarButtons] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [showSidebarRight, setShowSidebarRight] = useState(true);

  // Button data
  const BUTTONS_CONSTANTS = [
    {
      buttonKey: "addLayer",
      icon: PlusCircle,
      label: "Add Layer",
      onClick: () => handleButtonClick("addLayer"),
    },
    {
      buttonKey: "layers",
      icon: Layers3,
      label: "Layers",
      onClick: () => handleButtonClick("layers"),
    },
    {
      buttonKey: "tables",
      icon: Sheet,
      label: "Tables",
      onClick: () => handleButtonClick("tables"),
    },
    {
      buttonKey: "save",
      icon: Save,
      label: "Save",
      onClick: () => handleButtonClick("save"),
    },
    {
      buttonKey: "share",
      icon: Share2,
      label: "Share",
      onClick: () => handleButtonClick("share"),
    },
  ];

  // Define content for each button
  const BUTTON_CONTENT = {
    addLayer: <AddLayersContent />,
    layers: <LayersContent />,
    tables: <TablesContent />,
    save: <SaveContent />,
    share: <ShareContent />,
  };

  // Reusable Button component
  const SidebarButton = ({ buttonKey, icon: Icon, label, onClick }) => {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn("flex justify-start text-blackHaze-500", {
          "text-white": selectedButton === buttonKey,
        })}
      >
        <Icon
          className={cn("w-4 h-4 stroke-blackHaze-500", {
            "stroke-white stroke-2": selectedButton === buttonKey,
          })}
        />
        {!showSidebar && <span className="inline-block ml-2">{label}</span>}
      </Button>
    );
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
      {selectedButton && (
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
      {/* TODO: Fix this grid views */}
      <div
        className={cn(
          "fixed rounded-md border bottom-6 bg-white top-[60vh] h-[calc(100vh-60vh-24px)] pt-1 px-2 z-10",
          {
            "left-[300px] w-[calc(100vw-300px-60px)]":
              !expandedSidebarButtons && showSidebar,
            "left-[172px] w-[calc(100vw-172px-60px)]":
              expandedSidebarButtons && !showSidebar,
            "left-[412px] w-[calc(100vw-412px-60px)]":
              !expandedSidebarButtons && !showSidebar,
            "left-[60px] w-[calc(100vw-60px-60px)]":
              expandedSidebarButtons && showSidebar && showSidebarRight,
            "left-[60px] w-[calc(100vw-60px-192px)]":
              expandedSidebarButtons && showSidebar && !showSidebarRight,
          }
        )}
      >
        <DemoPaginationTable></DemoPaginationTable>
      </div>
      <div
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
      </div>
    </div>
  );
};

export default MapSidebar;
