"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { Shapes } from "lucide-react";
import { FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import FieldAliasContent from "./map-right-sidebar/field-alias-content";
import StyleContent from "./map-right-sidebar/style-content";
import useMapRightSidebar from "@/helpers/hooks/store/useMapRightSidebarStore";
import FilterContent from "./map-right-sidebar/filter-content";

const MapSidebarRight = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [expandedSidebarButtons, setExpandedSidebarButtons] = useState(false);

  // Agar bisa diakses di map-sidebar.jsx
  const {
    showRightSidebar,
    setShowRightSidebar,
    setExpandedRightSidebarButtons,
  } = useMapRightSidebar();

  // Define content for each button
  const BUTTON_CONTENT = {
    fieldAliasContent: <FieldAliasContent />,
    styleContent: <StyleContent />,
    filterContent: <FilterContent />,
  };

  const handleButtonClick = (buttonName) => {
    debugger;
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
    if (selectedButton == buttonName) {
      setExpandedSidebarButtons(false);
      setExpandedRightSidebarButtons(false);
    } else {
      setExpandedSidebarButtons(true);
      setExpandedRightSidebarButtons(true);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] right-0 bottom-10 z-10 bg-nileBlue-50 w-12 justify-end p-1 text-xs",
          {
            "w-28": showSidebar,
          }
        )}
      >
        <Button
          variant="ghost"
          className={cn("flex justify-end", {
            "p-0 justify-center": !showSidebar,
          })}
          onClick={() => handleButtonClick("styleContent")}
        >
          <Shapes
            className={cn("w-4 h-4 stroke-nileBlue-950 stroke-2", {
              // "stroke-white stroke-2": selectedButton === "save",
            })}
          />
          {showSidebar && <span className="inline-block ml-2">Styles</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn("flex justify-end", {
            "p-0 justify-center": !showSidebar,
          })}
          onClick={() => handleButtonClick("filterContent")}
        >
          <Filter
            className={cn("w-4 h-4 stroke-nileBlue-950 stroke-2", {
              // "stroke-white stroke-2": selectedButton === "save",
            })}
          />
          {showSidebar && <span className="inline-block ml-2">Filters</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn("flex justify-end", {
            "p-0 justify-center": !showSidebar,
          })}
          onClick={() => handleButtonClick("fieldAliasContent")}
        >
          <FilePenLine
            className={cn("w-4 h-4 stroke-nileBlue-950 stroke-2", {
              // "stroke-white stroke-2": selectedButton === "save",
            })}
          />
          {showSidebar && <span className="inline-block ml-2">Fields</span>}
        </Button>

        {/* Additional empty div for spacing, pushing the Collapse button to the bottom */}
        <div className="flex-grow" />

        <Button
          variant="ghost"
          className={cn("flex justify-end", {
            "p-0 justify-center": !showSidebar,
          })}
          onClick={() => {
            setShowSidebar((prev) => !prev);
            setShowRightSidebar(!showRightSidebar);
          }}
        >
          <ChevronLeft
            className={cn("!w-4 !h-4 transition-all", {
              "rotate-0": !showSidebar,
              "rotate-180": showSidebar,
            })}
          />
          {showSidebar && (
            <span className="inline-block ml-2 text-xs">Collapse</span>
          )}
        </Button>
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
      {(selectedButton === "fieldAliasContent" ||
        selectedButton === "styleContent" ||
        selectedButton === "filterContent") && (
        <div
          className={cn(
            "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] bottom-10 z-10 bg-blackHaze-50",
            {
              "right-12 w-60": !showSidebar,
              "right-28 w-60": showSidebar,
            }
          )}
        >
          {BUTTON_CONTENT[selectedButton]}
        </div>
      )}
    </div>
  );
};

export default MapSidebarRight;
