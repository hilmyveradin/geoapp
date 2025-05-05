import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { MoreVertical } from "lucide-react";
import { Check } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const EditPopupAttributes = () => {
  const { layersData, selectedPopupLayer, setSelectedPopupLayer } =
    useMapViewStore();

  // const [currentLayerRadio, setCurrentLayerRadio] = useState();
  const [layerFields, setLayerFields] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    if (!selectedPopupLayer) {
      setSelectedPopupLayer(layersData[0]);
      // setCurrentLayerRadio([layersData[0].layerUid]);
    }
  }, [layersData, selectedPopupLayer, setSelectedPopupLayer]);

  useEffect(() => {
    if (selectedPopupLayer) {
      async function fetchLayerData() {
        setIsFetching(true);

        try {
          const response = await fetch(
            `/api/get-layer-id?layerUid=${selectedPopupLayer.layerUid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const responseData = await response.json();

          setLayerFields(responseData.data[0].fieldAlias); // Adjust this if `data` structure is different
        } catch (error) {
          console.error("Failed to fetch layer data:", error);
          // Optionally handle error state
        }

        setIsFetching(false);
      }

      fetchLayerData();
    }
  }, [selectedPopupLayer]); // Make sure to include all dependencies here

  const toggleFieldSelected = (field) => {
    if (selectedFields.includes(field.fieldName)) {
      setSelectedFields(selectedFields.filter((f) => f !== field.fieldName));
    } else {
      setSelectedFields([...selectedFields, field.fieldName]);
    }
  };

  if (!selectedPopupLayer) {
    return null;
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="w-5 h-5 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-2 pr-2 mt-2 overflow-y-auto text-xs bg-nileBlue-50">
      <DropdownMenu className="h-10">
        <DropdownMenuTrigger asChild>
          <button className="flex gap-2">
            <p className="max-w-[120px] truncate">
              {selectedPopupLayer.layerTitle}
            </p>
            <ChevronDownIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={selectedPopupLayer}
            onValueChange={setSelectedPopupLayer}
          >
            {layersData.map((item, index) => {
              return (
                <DropdownMenuRadioItem
                  value={item}
                  key={`${item.layerUid}${index}`}
                  className="max-w-[120px] truncate"
                >
                  {item.layerTitle}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-col gap-2">
        <p>Field Lists</p>
        <p>
          {selectedFields.length} / {layerFields.length}
        </p>

        {layerFields.map((field, index) => (
          <button
            className="flex items-center gap-2 m-1 rounded-sm outline"
            key={index}
            onClick={() => toggleFieldSelected(field)}
          >
            {selectedFields.includes(field.fieldName) ? (
              <Check className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" /> // Empty div as a placeholder for unchecked items
            )}
            <div className="flex flex-col flex-grow gap-1 bg-blue-50">
              <p>{field.fieldName}</p>
              <p>{`{${field.fieldAlias ?? field.fieldName}}`}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical className="w-5 h-5 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem> Show field in popup </DropdownMenuItem>
                <DropdownMenuItem> Edit field alias </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EditPopupAttributes;
