import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { X } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Check } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const FieldAliasContent = () => {
  const { mapLayers, selectedLayer, setSelectedLayer, setMapClicked } =
    useMapViewStore();

  const [layerFields, setLayerFields] = useState(); // Responsible for all of the fields available
  const [selectedFields, setSelectedFields] = useState([]); // Responsible for checked array
  const [selectedFieldForEdit, setSelectedFieldForEdit] = useState();
  const [isFetching, setIsFetching] = useState(true);

  // useEffect(() => {
  //   if (!selectedLayer) {
  //     setSelectedLayer(mapLayers[0]);
  //   }
  // }, [mapLayers, selectedLayer, setSelectedLayer]);

  useEffect(() => {
    if (selectedLayer) {
      async function fetchLayerData() {
        setIsFetching(true);

        try {
          const response = await fetch(
            `/api/layers/get-layer-id?layerUid=${selectedLayer.layerUid}`,
            {
              method: "GET",
            }
          );
          const responseData = await response.json();

          const layerField = responseData.data[0].fieldAlias.filter(
            (item) => item.fieldName !== "__tsvector__"
          );

          setLayerFields(layerField);
          setSelectedFields(layerField);
        } catch (error) {
          console.error("Failed to fetch layer data:", error);
          // Optionally handle error state
        } finally {
          setIsFetching(false);
        }
      }
      fetchLayerData();
    }
  }, [selectedLayer]); // Make sure to include all dependencies here

  const saveFieldAliases = async (field, action) => {
    try {
      const body = {
        [field.fieldName]: field.fieldAlias,
      };
      const response = await fetch(
        `/api/layers/set-field-alias?layerUid=${selectedLayer.layerUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (action) {
        action();
      }
    } catch (error) {
      console.error("Failed to fetch layer data:", error);
    }
  };

  const toggleFieldSelected = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const setSelectedFieldAliasValue = (newField) => {
    if (newField && newField.fieldAlias) {
      saveFieldAliases(newField, () => {
        // Replace the field in layerFields that has the same fieldAlias as newField
        setLayerFields(
          layerFields.map((f) =>
            f.fieldName === newField.fieldName ? newField : f
          )
        );
        setSelectedFieldForEdit(null); // Clear the edit state more explicitly
      });
    } else {
      setSelectedFieldForEdit(null); // Just reset the edit state if no newField is provided
    }
  };

  if (!selectedLayer) {
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
    <>
      <div className="flex flex-col w-full h-full gap-2">
        <div className="flex flex-col w-full h-[full] gap-2 p-2 mb-2 overflow-y-auto bg-nileBlue-50">
          <DropdownMenu className="h-10">
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 text-white rounded-md bg-nileBlue-900">
                <p className="w-full truncate">{selectedLayer.layerTitle}</p>
                <ChevronDownIcon className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 text-white w-[224px] bg-nileBlue-900 pr-2">
              <DropdownMenuRadioGroup
                value={selectedLayer}
                onValueChange={setSelectedLayer}
              >
                {mapLayers.map((item, index) => {
                  return (
                    <DropdownMenuRadioItem
                      value={item}
                      key={`${item.layerUid}${index}`}
                      className="w-full"
                      dotClassName="fill-blue-500"
                    >
                      {item.layerTitle}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">Fields</p>

            {layerFields.map((field, index) => (
              <button
                className={cn(
                  "flex items-center gap-2 px-3 py-1 m-1 rounded-sm shadow-sm outline outline-neutral-500 text-xs",
                  {
                    "outline-nileBlue-300": selectedFieldForEdit === field,
                  }
                )}
                key={index}
                onClick={() => toggleFieldSelected(field)}
              >
                {selectedFields.includes(field) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4" /> // Empty div as a placeholder for unchecked items
                )}
                <div className="flex flex-col flex-grow gap-1 text-left bg-blue-50">
                  <p className="font-bold text-md">
                    {field.fieldAlias ?? field.fieldName}
                  </p>
                  <p>{`{${field.fieldName}}`}</p>
                </div>
                <PencilIcon
                  className="w-5 h-5 p-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFieldForEdit(field);
                  }}
                />
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <PencilIcon className="w-5 h-5 p-1 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="text-white bg-nileBlue-900"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setMapClicked(true);
                      }}
                    >
                      {" "}
                      Show field in popup{" "}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFieldForEdit(field);
                      }}
                    >
                      {" "}
                      Edit field alias{" "}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedFieldForEdit && (
        <EditFieldPopup
          setSelectedFieldAliasValue={setSelectedFieldAliasValue}
          selectedFieldForEdit={selectedFieldForEdit}
        />
      )}
    </>
  );
};

const EditFieldPopup = (props) => {
  const { selectedFieldForEdit, setSelectedFieldAliasValue } = props;
  const [temporaryName, setTemporaryName] = useState("");
  const [currentField, setCurrentField] = useState(selectedFieldForEdit);

  const handleTemporaryNameInput = (e) => {
    // Capture the new name from the input event
    const tempAlias = e.target.value;

    // Set the temporaryName state, which might be used somewhere else in the UI
    setTemporaryName(tempAlias);

    // Update currentField with the new fieldName while keeping the same fieldAlias
    setCurrentField({
      ...currentField, // This spread operator ensures all other attributes (if any) are carried over
      fieldAlias: tempAlias, // Updates fieldName with the new value
    });
  };

  return (
    <div
      className={cn(
        "w-72 rounded-md shadow-sm z-10 fixed top-28 right-[296px] flex flex-col gap-3 p-2 bg-white"
      )}
    >
      <div className="flex justify-between">
        <p>Formatting</p>
        <X
          className="cursor-pointer w-7 h-7"
          onClick={() => {
            setSelectedFieldAliasValue();
          }}
        />
      </div>
      <p>Display Name</p>
      <Input
        placeholder={
          selectedFieldForEdit?.fieldName ?? selectedFieldForEdit.fieldAlias
        }
        value={temporaryName}
        onChange={handleTemporaryNameInput} // Corrected from onValueChange to onChange
      />
      <Button onClick={() => setSelectedFieldAliasValue(currentField)}>
        Save
      </Button>
    </div>
  );
};

export default FieldAliasContent;
