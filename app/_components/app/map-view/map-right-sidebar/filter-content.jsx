"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import useTableQueryStore from "@/helpers/hooks/store/useTableQueryStore";
import { Trash2 } from "lucide-react";

const FilterContent = () => {
  const { mapLayers, selectedLayer, setSelectedLayer, setHighlightedLayer } =
    useMapViewStore();

  const { ftsQuery, setFtsQuery } = useTableQueryStore();

  const { toast } = useToast();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [ftsQueryInput, setFtsQueryInput] = useState("");
  const [savedFtsQuery, setSavedFtsQuery] = useState("");

  // useEffect(() => {
  //   if (!selectedLayer) {
  //     setSelectedLayer(mapLayers[0]);
  //   }
  // }, [mapLayers, selectedLayer, setSelectedLayer]);

  useEffect(() => {
    const saveFilter = async () => {
      try {
        setIsSavingChanges(true);
        const body = JSON.stringify({
          fts_input: ftsQuery.value,
          with_geom: true,
        });
        const response = await fetch(
          `/api/layers/get-fts-query-data?layerUid=${selectedLayer.layerUid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.msg.includes("FTS query successful")) {
          const highlightedLayerGeoJSON = {
            type: "FeatureCollection",
            features: data.data,
          };

          setHighlightedLayer(highlightedLayerGeoJSON);
        } else {
          throw new Error("FTS Query Failed");
        }
      } catch (error) {
        console.error("Error fetching rows:", error);
      } finally {
        setIsSavingChanges(false);
      }
    };

    if (ftsQuery) {
      saveFilter();
    }
  }, [ftsQuery, selectedLayer, setHighlightedLayer]);

  const saveFtsQuery = () => {
    setFtsQuery({ value: ftsQueryInput });
    // Reset FtsQueryInput
    setSavedFtsQuery(ftsQueryInput);
  };

  const resetFts = () => {
    setFtsQueryInput("");
    setFtsQuery(null);
    setSavedFtsQuery("");
    setHighlightedLayer(null);
  };

  if (!selectedLayer) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 p-2 overflow-y-auto">
      <DropdownMenu
        className="h-10"
        open={openDropdown}
        onOpenChange={setOpenDropdown}
      >
        <DropdownMenuTrigger asChild className="w-full">
          <button className="flex items-center gap-2 px-3 py-2 text-white rounded-md bg-nileBlue-900">
            <p className="w-full truncate">{selectedLayer.layerTitle}</p>
            <ChevronDownIcon
              className={cn("w-5 h-5 transition-all", {
                "-rotate-180": openDropdown,
              })}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 text-white w-[224px] bg-nileBlue-900 pr-2">
          <DropdownMenuRadioGroup
            value={selectedLayer}
            onValueChange={(value) => {
              setSelectedLayer(value);
              resetFts();
            }}
          >
            {mapLayers.map((layer) => {
              return (
                <DropdownMenuRadioItem
                  value={layer}
                  key={`${layer.layerUid}`}
                  className="w-full"
                  dotClassName="!fill-rose-800	"
                >
                  {layer.layerTitle}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {savedFtsQuery && (
        <button className="flex justify-between p-2" onClick={resetFts}>
          <p>Remove Filter</p>
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      <Textarea
        placeholder="Filter using numeric values with the format: [field_name]>[value]. Example: “:year>2022”"
        className="h-32"
        value={ftsQueryInput} // Bind the Textarea value to the ftsQueryInput state
        onChange={(e) => {
          setFtsQueryInput(e.target.value); // Correctly update the state based on event's target value
        }}
      />
      <div className="h-full" />

      <Button
        className="font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
        onClick={saveFtsQuery}
        disabled={isSavingChanges}
      >
        {isSavingChanges ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
            <span className="font-bold">Please wait</span>
          </span>
        ) : (
          <span>Save</span>
        )}
      </Button>
    </div>
  );
};

export default FilterContent;
