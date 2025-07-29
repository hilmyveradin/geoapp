"use strict";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import TooltipText from "../../shared/tooltip-text";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "./styles.css";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import useMapSidebarStore from "@/helpers/hooks/store/use-map-sidebar-store";

export function Combobox({ layerTitles, value }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[50%] flex justify-between bg-nileBlue-50 hover:bg-nileBlue-50 shadow-md"
        >
          <div className="w-[90%] flex items-center">
            <TooltipText
              content={
                value
                  ? layerTitles.find(
                      (layerTitles) => layerTitles.value === value
                    )?.label
                  : "Select layer title"
              }
              side="top"
              align="start"
            >
              <p className="text-base font-normal text-black truncate cursor-pointer">
                {value
                  ? layerTitles.find(
                      (layerTitles) => layerTitles.value === value
                    )?.label
                  : "Select layer title"}
              </p>
            </TooltipText>
          </div>
          <ChevronDown className="shrink-0 text-nileBlue-950" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0"></PopoverContent>
    </Popover>
  );
}

export function Table({ inputLayerDataArray, value, layerTitles, pageIdx }) {
  let rows = [];

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      field: "key",
      tooltipValueGetter: (p) => p.value,
      minWidth: 100,
    },
    {
      field: "value",
      tooltipValueGetter: (p) => p.value,
      minWidth: 175,
    },
  ]);
  if (value !== "" && pageIdx !== null && pageIdx !== undefined) {
    const index = layerTitles.findIndex(
      (layerTitle) => layerTitle.value === value
    );
    rows = inputLayerDataArray[index][pageIdx];
  } else {
    rows = [];
  }
  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
      defaultMinWidth: 100,
    };
  }, []);

  // disable sorting on all columns
  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
    };
  }, []);

  return (
    <div
      className={"ag-theme-quartz-custom"} // applying the grid theme
      style={{ height: 125 }} // the grid will fill the size of the parent container
    >
      <AgGridReact
        rowData={rows}
        columnDefs={colDefs}
        autoSizeStrategy={autoSizeStrategy}
        tooltipShowDelay={0}
        tooltipHideDelay={2000}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}

export default function GeojsonCard() {
  const {
    objectInfoData,
    mapClicked,
    setMapClicked,
    mapLayers,
    setHighlightedLayer,
  } = useMapViewStore();

  const {
    showRightSidebar,
    expandedRightSidebarContent,
    showLeftSidebar,
    expandedLeftSidebarContent,
  } = useMapSidebarStore();

  const ref = useRef();
  const [bounds, setBounds] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const calculateBounds = (ref) => {
    if (!ref.current)
      return { top: -1000, left: -1000, right: -1000, bottom: -1000 };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { left, width, height } = ref.current.getBoundingClientRect();

    let leftBoundary = 48; // Default left margin
    if (showLeftSidebar) {
      if (expandedLeftSidebarContent) {
        leftBoundary = 160 + 240; // Sidebar visible and content expanded
      } else {
        leftBoundary = 160; // Sidebar visible but content not expanded
      }
    } else if (expandedLeftSidebarContent) {
      leftBoundary = 240 + 48; // Sidebar not visible but content expanded
    }

    let rightBoundary = 48; // Default right margin
    if (showRightSidebar) {
      if (expandedRightSidebarContent) {
        rightBoundary = 112 + 240; // Right sidebar visible and content expanded
      } else {
        rightBoundary = 112; // Right sidebar visible but content not expanded
      }
    } else if (expandedRightSidebarContent) {
      rightBoundary = 240 + 48; // Right sidebar not visible but content expanded
    }

    return {
      left: -left + leftBoundary,
      top: 0, // Fixed top boundary as per your previous instructions
      right: viewportWidth - left - width - rightBoundary,
      bottom: 999999,
    };
  };

  const layerTitles = objectInfoData.data
    .filter((layer) => {
      const matchingLayer = mapLayers.find(
        (mapLayer) => mapLayer.layerTitle === layer.layerTitle
      );
      return matchingLayer && matchingLayer.isShown;
    })
    .map((layer) => ({
      value: layer.layerTitle.toLowerCase(),
      label: layer.layerTitle,
    }))
    .reverse();

  const layerDataArray = objectInfoData.data
    .map((layer) => [...layer.layerData])
    .reverse();
  const newObjects = layerDataArray.map((objArray) =>
    objArray.map((obj) => {
      const { properties } = obj;
      return Object.entries(properties).map(([key, value]) => ({
        key,
        value: value === null ? "empty" : value.toString(),
      }));
    })
  );
  const [value, setValue] = useState(
    layerTitles.length > 0 ? layerTitles[0].value : ""
  );
  const [pageIdx, setPageIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setBounds(calculateBounds(ref));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showLeftSidebar,
    expandedLeftSidebarContent,
    showRightSidebar,
    expandedRightSidebarContent,
  ]); // Dependencies that trigger re-calculation

  const index = layerTitles.findIndex(
    (layerTitle) => layerTitle.value === value
  );
  const handlePrevClick = () => {
    if (index !== -1 && pageIdx !== null) {
      if (pageIdx === 0) {
        setPageIdx(newObjects[index].length - 1);
      } else {
        setPageIdx(pageIdx - 1);
      }
    }
  };

  const handleNextClick = () => {
    if (index !== -1 && pageIdx !== null) {
      if (pageIdx === newObjects[index].length - 1) {
        setPageIdx(0);
      } else {
        setPageIdx(pageIdx + 1);
      }
    }
  };

  const handleTogglePopUp = () => {
    setMapClicked(!mapClicked);
    setHighlightedLayer(null);
  };

  return (
    <div>
      {layerTitles.length > 0 && (
        <Card className="bg-nileBlue-50 rounded-md w-[35vw] handle">
          <div className="flex flex-col py-3 space-y-3">
            <div className="flex flex-row justify-between px-6">
              <div />
              <div className="flex flex-row items-center mt-1 text-nileBlue-950">
                <button onClick={handleTogglePopUp}>
                  <X />
                </button>
              </div>
            </div>
            <Separator />
            <div className="flex flex-row justify-between px-6">
              <div className="flex items-center p-1 rounded-md shadow-md bg-nileBlue-50 text-nileBlue-800">
                <button onClick={handlePrevClick}>
                  <ChevronLeft />
                </button>
                <Label>
                  {pageIdx === null ? "" : pageIdx + 1} of{" "}
                  {pageIdx === null || index === -1
                    ? ""
                    : newObjects[index].length}
                </Label>
                <button onClick={handleNextClick}>
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
          {isExpanded && (
            <CardContent className="flex flex-col">
              <Table
                inputLayerDataArray={newObjects}
                value={value}
                layerTitles={layerTitles}
                pageIdx={pageIdx}
              />
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
