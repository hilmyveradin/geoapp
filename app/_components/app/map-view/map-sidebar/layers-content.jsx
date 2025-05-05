"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const LayersContent = () => {
  const { layersData, setLayersData, mapData } = useMapViewStore();

  if (!layersData) {
    return null;
  }

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(layersData);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    const body = {
      mapLayerUid: reorderedItems.map((item) => item.layerUid),
      mapUid: mapData.mapUid,
    };

    try {
      const response = await fetch(`/api/reorder-layer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        debugger;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }

    // Update your state with the new items array
    // For example, if you're managing your state in a store or with useState:
    setLayersData(reorderedItems);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto ">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppableId">
          {(provided, snapshot) => (
            <div
              style={{
                backgroundColor: snapshot.isDraggingOver ? "blue" : "grey",
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {layersData.map((item, index) => (
                <Draggable
                  key={`${item.layerUid}`}
                  draggableId={`${item.layerUid}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <LayersCard data={item} />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LayersContent;

const LayersCard = ({ data }) => {
  const buttonIcons = [
    "/app/map-view/icon-1.svg",
    "/app/map-view/icon-2.svg",
    "/app/map-view/icon-3.svg",
    "/app/map-view/icon-4.svg",
  ];

  const { selectedLayers, removeSelectedLayers, addSelectedLayers } =
    useMapViewStore();

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (selectedLayers) {
      setIsChecked(selectedLayers.some((layer) => layer === data));
    }
  }, [selectedLayers, data]);

  const handleCheckboxChange = () => {
    if (isChecked) {
      removeSelectedLayers(data);
    } else {
      addSelectedLayers(data);
    }
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-start w-full h-20 gap-3 mb-3 ml-3">
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleCheckboxChange}
        className="w-6 h-6 mt-[2px]"
      />
      <div className="flex flex-col gap-2">
        <p className="text-lg truncate">{data.layerTitle}</p>
        <div className="flex items-center gap-4">
          {buttonIcons.map((item, index) => {
            return (
              <img
                key={`${item}-${index}`}
                src={item}
                className="flex items-center w-5 h-5 cursor-pointer"
              />
            );
          })}

          <Separator orientation="vertical" className="w-[2px] h-6" />
          <MoreHorizontal className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
