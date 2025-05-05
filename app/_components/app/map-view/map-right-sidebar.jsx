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
import FilterContent from "./map-right-sidebar/filter-content";
import useMapSidebarStore from "@/helpers/hooks/store/use-map-sidebar-store";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import TooltipText from "@/app/_components/shared/tooltip-text";

const MapRightSidebar = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  // Agar bisa diakses di map-sidebar.jsx
  const {
    showRightSidebar,
    setShowRightSidebar,
    setExpandedRightSidebarContent,
  } = useMapSidebarStore();

  const { selectedLayer } = useMapViewStore();

  useEffect(() => {
    if (!selectedLayer) {
      setSelectedButton(null);
    }
  }, [selectedLayer]);

  // Define content for each button
  const BUTTON_CONTENT = {
    styleContent: <StyleContent />,
    fieldAliasContent: <FieldAliasContent />,
    filterContent: <FilterContent />,
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
    if (selectedButton == buttonName) {
      setExpandedRightSidebarContent(false);
    } else {
      setExpandedRightSidebarContent(true);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] right-0 bottom-10 z-50 bg-nileBlue-50 w-12 justify-end p-1 text-xs",
          {
            "w-28": showRightSidebar,
          }
        )}
      >
        <TooltipText
          content="Edit style"
          side="left"
          align="start"
        >
          <Button
            variant="ghost"
            className={cn("flex justify-center", {
              "p-0 justify-center": !showRightSidebar,
              "stroke-white stroke-2 bg-nileBlue-400":
                selectedButton === "styleContent",
            })}
            onClick={() => handleButtonClick("styleContent")}
            disabled={!selectedLayer}
          >
            <Shapes
              className={cn("w-4 h-4 stroke-nileBlue-950 stroke-2", {
                "stroke-white stroke-2": selectedButton === "styleContent",
              })}
            />
            {showRightSidebar && (
              <span className="inline-block ml-2">Styles</span>
            )}
          </Button>
        </TooltipText>
        <TooltipText
          content="Filter layer"
          side="left"
          align="start"
        >
          <Button
            variant="ghost"
            className={cn("flex justify-center", {
              "p-0 justify-center": !showRightSidebar,
              "stroke-white stroke-2 bg-nileBlue-400":
                selectedButton === "filterContent",
            })}
            onClick={() => handleButtonClick("filterContent")}
            disabled={!selectedLayer}
          >
            <Filter
              className={cn("w-4 h-4 stroke-nileBlue-950 stroke-2", {
                "stroke-white stroke-2": selectedButton === "filterContent",
              })}
            />
            {showRightSidebar && (
              <span className="inline-block ml-2">Filters</span>
            )}
          </Button>
        </TooltipText>
        <TooltipText
          content="Edit field alias"
          side="left"
          align="start"
        >
          <Button
            variant="ghost"
            className={cn("flex justify-center", {
              "p-0 justify-center": !showRightSidebar,
              " bg-nileBlue-400": selectedButton === "fieldAliasContent",
            })}
            onClick={() => handleButtonClick("fieldAliasContent")}
            disabled={!selectedLayer}
          >
            <FilePenLine
              className={cn("w-4 h-4 stroke-nileBlue-950 stroke-2", {
                "stroke-white stroke-2": selectedButton === "fieldAliasContent",
              })}
            />
            {showRightSidebar && (
              <span className="inline-block ml-2">Fields</span>
            )}
          </Button>
        </TooltipText>

        {/* Additional empty div for spacing, pushing the Collapse button to the bottom */}
        <div className="flex-grow" />

        <Button
          variant="ghost"
          className={cn("flex justify-end", {
            "p-0 justify-center": !showRightSidebar,
          })}
          onClick={() => {
            setShowRightSidebar(!showRightSidebar);
          }}
        >
          <ChevronLeft
            className={cn("!w-4 !h-4 transition-all", {
              "rotate-0": !showRightSidebar,
              "rotate-180": showRightSidebar,
            })}
          />
          {showRightSidebar && (
            <span className="inline-block ml-2 text-xs">Collapse</span>
          )}
        </Button>
      </div>
      {(selectedButton === "fieldAliasContent" ||
        selectedButton === "styleContent" ||
        selectedButton === "filterContent") && (
        <div
          className={cn(
            "flex flex-col fixed top-[56px] h-[calc(100vh-56px)] bottom-10 z-10 bg-blackHaze-50",
            {
              "right-12 w-60": !showRightSidebar,
              "right-28 w-60": showRightSidebar,
            }
          )}
        >
          {BUTTON_CONTENT[selectedButton]}
        </div>
      )}
    </div>
  );
};

export default MapRightSidebar;
