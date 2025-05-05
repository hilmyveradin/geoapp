"use client";

import Image from 'next/image'
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
import AddLayerContent from "./map-sidebar/add-layer-content";
import LegendsContent from "./map-sidebar/legends-content";
import TablesContent from "./map-sidebar/tables-content";
import SaveContent from "./map-sidebar/save-content";
import ShareContent from "./map-sidebar/share-content";
import { Separator } from "@/components/ui/separator";
import { DataTableDemo } from '../layer-table/layer-table';
import { ButtonSidebar } from '@/components/ui/button-sidebar';
import { GridExample } from '@/app/_components/app/layer-table/ag-grid-react';
const MapSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showButtonSidebar, setShowButtonSidebar] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  const [showSidebarRight, setShowSidebarRight] = useState(true);

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
      buttonKey: "legends",
      icon: <List className={cn("w-4 h-4")} />,
      label: "Legends",
      onClick: () => handleButtonClick("legends"),
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
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
    setShowButtonSidebar((prev) => !prev);
  };

  return (
    <div className="">
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
              {["legends", "share"].includes(data.buttonKey) && (
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
              "left-12 w-60": showSidebar,
              "left-40 w-60": !showSidebar,
            }
          )}
        >
          {BUTTON_CONTENT[selectedButton]}
        </div>
      )}
      <div
        className = {cn(
          "fixed rounded-md border bottom-6 z-10 bg-white top-[60vh] h-[calc(100vh-60vh-24px)] pt-1 px-2",
          {
            "left-[300px] w-[calc(100vw-300px-60px)]": !showButtonSidebar && showSidebar,
            "left-[172px] w-[calc(100vw-172px-60px)]": showButtonSidebar && !showSidebar,
            "left-[412px] w-[calc(100vw-412px-60px)]": !showButtonSidebar && !showSidebar,
            "left-[60px] w-[calc(100vw-60px-60px)]": showButtonSidebar && showSidebar && showSidebarRight,
            "left-[60px] w-[calc(100vw-60px-192px)]": showButtonSidebar && showSidebar && !showSidebarRight,
          }
        )}>
          <GridExample></GridExample>
      </div>
      <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] right-0 bottom-10 z-10 bg-white w-[48px]",
          {
            "w-[180px]": !showSidebarRight,
          },
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
          {!showSidebarRight && <span className="ml-2 inline-block">Style</span>}
        </ButtonSidebar>
        <ButtonSidebar variant="ghostLeft" onClick={() => setShowSidebarRight((prev) => !prev)}>
          <ChevronRight
            className={cn("w-4 h-4", {
              "-rotate-180": showSidebarRight,
            })}
          />
          {!showSidebarRight && <span className="ml-2 inline-block">Collapse</span>}
        </ButtonSidebar>
      </div>
    </div>
  );
};

export default MapSidebar;
