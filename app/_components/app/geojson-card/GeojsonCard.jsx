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

export function ComboboxDemo({layerTitles}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
 
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

export function DemoTable() {
  const [rowData, setRowData] = useState([
    { make: "Ford", model: "F-Series"},
    { make: "Tesla", model: "Model Y"},
    { make: "Toyota", model: "Corolla"},
  ]);
  
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "make" },
    { field: "model" },
  ]);

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);
  
  return (
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 170, maxWidth: 400 }} // the grid will fill the size of the parent container
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        autoSizeStrategy={autoSizeStrategy}
      />
    </div>
  )
}

export default function GeojsonCard() {
  const [curObjIdx, setCurObjIdx] = useState(0)
  const { objectInfoData } = useMapViewStore();
  console.log(objectInfoData.data);
  const layerTitles = objectInfoData.data.map((layer) => ({
    value: layer.layerTitle.toLowerCase(),
    label: layer.layerTitle,
  }));
  console.log(layerTitles);

  return (
    <Card className="w-[35vw] h-[50vh]">
      <div className="flex flex-col space-y-3 px-6 pt-6 pb-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row">
            <ZoomIn/>
            <Label className="ml-2 mt-1 inline-block">Zoom to</Label>
          </div>
          <div className="flex items-center">
            <ChevronLeft />
            <Label>{curObjIdx+1} of {objects.length}</Label>
            <ChevronRight />
          </div>
        </div>
        <ComboboxDemo 
          layerTitles={layerTitles}
        />
      </div>
      <CardContent className="flex flex-col">
        <DemoTable/>
      </CardContent>
    </Card>
  )
}