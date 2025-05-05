import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const EditPopupAttributes = () => {
  const { layersData, selectedPopupLayer, setSelectedPopupLayer } =
    useMapViewStore();

  useEffect(() => {
    if (!selectedPopupLayer) {
      setSelectedPopupLayer(layersData[0]);
    }
  }, [layersData, selectedPopupLayer, setSelectedPopupLayer]);

  return (
    <div className="flex flex-col w-full h-full pr-2 mt-2 overflow-y-auto text-xs bg-nileBlue-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex gap-2">
            {selectedPopupLayer.layerTitle}
            <ChevronDownIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {layersData.map((item, index) => {
            return (
              <DropdownMenuItem key={`${item.layerUid}${index}`}>
                {item.layerTitle}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EditPopupAttributes;
