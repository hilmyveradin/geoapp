"use client";

import TooltipText from "@/app/_components/shared/tooltipText";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { cn } from "@/lib/utils";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
// import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { MoreVertical } from "lucide-react";
import { Table } from "lucide-react";
import { PencilIcon } from "lucide-react";
import { Trash } from "lucide-react";
import { ZoomIn } from "lucide-react";
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
    <div className="flex flex-col w-full h-full pr-2 mt-2 overflow-y-auto text-xs">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppableId">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
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
                      <div className="px-2 mb-4">
                        {/* <LayersCard data={item} /> */}
                        <NewLayersCard data={item} />
                      </div>
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

const NewLayersCard = ({ data }) => {
  // const [viewLayer, setViewLayer] = useState(true)
  // const [viewOptions, setViewOptions] = useState(false)

  const [collapsibleContent, setCollapsibleContent] = useState("layer");
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const handleHideShowChange = () => {
    if (isChecked) {
      removeSelectedLayers(data);
    } else {
      addSelectedLayers(data);
    }
    setIsChecked(!isChecked);
  };

  return (
    <>
      <TooltipText content={data.layerTitle}>
        <div
          className="relative flex items-center justify-center h-10 gap-2 px-2 bg-white border rounded-md shadow-md cursor-pointer w-54"
          onClick={() => {
            if (collapsibleContent === "layer") {
              debugger;
              setCollapsibleContent(null);
              setImageLoaded(false);
            } else {
              setCollapsibleContent("layer");
            }
          }}
        >
          <div
            className={cn(
              "absolute top-0 left-0 bottom-0 bg-gableGreen-500 transition-all",
              {
                "duration-300 w-2 rounded-l-md": collapsibleContent,
                "w-0 rounded-l-lg": !collapsibleContent,
              }
            )}
          />

          <p className="px-2 pr-2 text-xs truncate max-w-20">
            {data.layerTitle}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleHideShowChange();
            }}
          >
            {isChecked ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </button>

          <MoreHorizontal
            className="justify-end w-8 h-8 ml-auto stroke-2" // Added ml-auto here
            onClick={(e) => {
              e.stopPropagation();
              debugger;
              if (collapsibleContent === "options") {
                setCollapsibleContent(null);
                setImageLoaded(false);
              } else {
                setCollapsibleContent("options");
              }
            }}
          />
        </div>
      </TooltipText>
      {collapsibleContent === "layer" && (
        <div className="flex items-center gap-2 p-2 bg-white border-b border-l border-r rounded-md shadow-md">
          <p>Legend symbol: </p>
          {!imageLoaded && <Skeleton className="w-5 h-5 rounded-full" />}
          <img
            key={`${data}`}
            src={data.legendUrl}
            className="w-5 h-5"
            alt="legend logo"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>
      )}
      {collapsibleContent === "options" && <OptionsSection />}
    </>
  );
};

const OptionsSection = () => {
  const buttonLists = [
    {
      icon: <ZoomIn className="w-3 h-3 stroke-2" />,
      name: "Zoom to",
    },
    {
      icon: <Table className="w-3 h-3 stroke-2" />,
      name: "Show Table",
    },
    {
      icon: <PencilIcon className="w-3 h-3 stroke-2" />,
      name: "Rename",
    },
    {
      icon: <Trash className="w-3 h-3 stroke-2" />,
      name: "Remove",
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-2 bg-white border-b border-l border-r rounded-md shadow-md">
      {buttonLists.map((item, index) => (
        <button
          key={`button-${item}-${index}`}
          className="flex items-center justify-start gap-2 p-1"
        >
          <span>{item.icon}</span>
          {item.name}
        </button>
      ))}
    </div>
  );
};
