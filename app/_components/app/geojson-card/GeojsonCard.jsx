import React, { 
  useState,
  useMemo 
} from "react";
import { 
  Check, 
  ChevronsUpDown, 
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";

const objects = ["obj1", "obj2"];

export function ComboboxDemo({layerTitles, value, setValue, setPageIdx}) {
  const [open, setOpen] = useState(false)
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100%] flex justify-between"
          title={value
            ? layerTitles.find((layerTitles) => layerTitles.value === value)?.label
            : "Select layer title"}
        >
          <div className="w-[90%] flex items-center">
            <span className="text-ellipsis overflow-hidden truncate">{value
              ? layerTitles.find((layerTitles) => layerTitles.value === value)?.label
              : "Select layer title"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select layer title..." />
          <CommandEmpty>No layer title found.</CommandEmpty>
          <CommandGroup>
            {layerTitles.map((layerTitle) => (
              <CommandItem
                key={layerTitle.value}
                value={layerTitle.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  setPageIdx(currentValue === value ? null : 0)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === layerTitle.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="w-[80%] text-ellipsis overflow-hidden truncate">
                  {layerTitle.label}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function DemoTable({inputLayerDataArray, value, layerTitles, pageIdx}) {
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
  console.log(value);
  if (value !== "" && (pageIdx !== null && pageIdx !== undefined)) {
    const index = layerTitles.findIndex(
      (layerTitle) => layerTitle.value === value
    );
    rows = inputLayerDataArray[index][pageIdx];
} else {
    rows = [];
  }
  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitCellContents",
    };
  }, []);
  return (
    <div
      className="ag-theme-quartz-dark" // applying the grid theme
      style={{ height: 150 }} // the grid will fill the size of the parent container
    >
      <AgGridReact
        rowData={rows}
        columnDefs={colDefs}
        autoSizeStrategy={autoSizeStrategy}
        tooltipShowDelay={0}
        tooltipHideDelay={2000}
      />
    </div>
  )
}

export default function GeojsonCard() {
  const { objectInfoData } = useMapViewStore();

  const layerTitles = objectInfoData.data.map((layer) => ({
    value: layer.layerTitle.toLowerCase(),
    label: layer.layerTitle,
  }));
  const layerDataArray = objectInfoData.data.map(layer => [...layer.layerData]);
  const newObjects = layerDataArray.map(objArray => 
    objArray.map(obj => {
      const { geom, ...rest } = obj;
      return Object.entries(rest).map(([key, value]) => ({ 
        key, 
        value: value === null ? "empty" : value.toString()}));
    })
  );
  const [value, setValue] = useState("");
  const [pageIdx, setPageIdx] = useState(null);
  const index = layerTitles.findIndex(
    (layerTitle) => layerTitle.value === value
  );
  const handlePrevClick = () => {
    if (index !== -1 && pageIdx !== null && pageIdx > 0) {
      setPageIdx(pageIdx - 1);
    }
  }
  const handleNextClick = () => {
    if (index !== -1 && pageIdx !== null && pageIdx < newObjects[index].length - 1) {
      setPageIdx(pageIdx + 1);
    }
  }

  return (
    <Card className="w-[35vw] h-[45vh]">
      <div className="flex flex-col space-y-3 px-6 pt-6 pb-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row">
            <ZoomIn/>
            <Label className="ml-2 mt-1 inline-block">Zoom to</Label>
          </div>
          <div className="flex items-center">
            <button onClick={handlePrevClick}>
              <ChevronLeft/>
            </button>
            <Label>{pageIdx === null ? "" : pageIdx+1} of {pageIdx === null || index === -1 ? "" : newObjects[index].length}</Label>
            <button onClick={handleNextClick}>
              <ChevronRight/>
            </button>
          </div>
        </div>
        <ComboboxDemo 
          layerTitles={layerTitles}
          value={value} // Pass value prop
          setValue={setValue} // Pass setValue prop
          setPageIdx={setPageIdx}
        />
      </div>
      <CardContent className="flex flex-col">
        <DemoTable 
          inputLayerDataArray={newObjects}
          value={value}
          layerTitles={layerTitles}
          pageIdx={pageIdx}
          />
      </CardContent>
    </Card>
  )
}