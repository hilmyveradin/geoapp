"use strict";

import React, { useState, useMemo } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import TooltipText from "../../shared/tooltipText";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import "./styles.css";

export function Combobox({ layerTitles, value, setValue, setPageIdx }) {
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
      <PopoverContent className="w-[200px] p-0">
        <Command className="w-full">
          <CommandInput placeholder="Select layer title..." />
          <CommandEmpty>No layer title found.</CommandEmpty>
          <CommandGroup>
            {layerTitles.map((layerTitle) => (
              <CommandItem
                key={layerTitle.value}
                value={layerTitle.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  setPageIdx(currentValue === value ? null : 0);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === layerTitle.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <TooltipText
                  content={layerTitle.label}
                  side="top"
                  align="start"
                >
                  <p className="text-base font-normal truncate cursor-pointer">
                    {layerTitle.label}
                  </p>
                </TooltipText>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
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
    setZoomedLayerBbox,
  } = useMapViewStore();

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

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTogglePopUp = () => {
    setMapClicked(!mapClicked);
    setHighlightedLayer(null);
  };

  const handleZoomandHighlightLayer = () => {
    const layerTitle = layerTitles.find(
      (layerTitle) => layerTitle.value === value
    )?.label; // Get the actual title from the state value

    if (layerTitle) {
      const matchingLayer = mapLayers.find(
        (mapLayer) => mapLayer.layerTitle === layerTitle
      );

      if (matchingLayer && matchingLayer.layerBbox) {
        setZoomedLayerBbox(matchingLayer.layerBbox); // Assuming this function sets the map view to the bbox
        const selectedLayerData =
          layerDataArray[
            layerTitles.findIndex((lt) => lt.label === layerTitle)
          ];
        if (selectedLayerData) {
          const highlightedLayerGeoJSON = {
            type: "FeatureCollection",
            features: selectedLayerData,
          };
          setHighlightedLayer(highlightedLayerGeoJSON);
        }
      }
    }
  };

  return (
    <>
      {layerTitles.length > 0 && (
        <Card className="bg-nileBlue-50 rounded-md w-[35vw]">
          <div className="flex flex-col py-3 space-y-3">
            <div className="flex flex-row justify-between px-6">
              <Combobox
                layerTitles={layerTitles}
                value={value}
                setValue={setValue}
                setPageIdx={setPageIdx}
              />
              <div className="flex flex-row items-center mt-1 text-nileBlue-950">
                <button onClick={handleToggleExpand}>
                  <ChevronUp
                    className={`mr-2 transition-transform ${
                      isExpanded ? "" : "rotate-180"
                    }`}
                  />
                </button>
                <button onClick={handleTogglePopUp}>
                  <X />
                </button>
              </div>
            </div>
            <Separator />
            <div className="flex flex-row justify-between px-6">
              <button
                className="flex flex-row p-1"
                onClick={handleZoomandHighlightLayer}
              >
                <ZoomIn className="text-nileBlue-950" />
                <Label className="inline-block mt-1 ml-2 text-nileBlue-800">
                  Zoom to
                </Label>
              </button>
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
    </>
  );
}
