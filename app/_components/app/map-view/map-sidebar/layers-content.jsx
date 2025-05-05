"use client";

import TooltipText from "@/app/_components/shared/tooltipText";
import { Skeleton } from "@/components/ui/skeleton";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { cn } from "@/lib/utils";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { Table } from "lucide-react";
import { Trash } from "lucide-react";
import { ZoomIn } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const LayersContent = () => {
  const { layersData, setLayersData } = useMapViewStore();

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

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

    setLayersData(reorderedItems);
  };

  return (
    <div className="flex flex-col w-full h-full pr-2 mt-2 overflow-y-auto text-xs bg-nileBlue-50">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppableId">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {layersData.map((item, index) => (
                <Draggable
                  key={`${item.layerUid}`}
                  draggableId={`${item.layerUid}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="px-2 mb-4"
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
  const [collapsibleContent, setCollapsibleContent] = useState("layer");
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const resetCollapsibleContent = () => {
    setCollapsibleContent("layer");
  };

  return (
    <div>
      <TooltipText content={data.layerTitle} side="top" align="start">
        <div
          className="relative flex items-center h-10 gap-2 px-2 bg-white border rounded-md shadow-md cursor-pointer w-54"
          onClick={() => {
            if (collapsibleContent === "layer") {
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
                "w-2 rounded-l-md": collapsibleContent,
              }
            )}
          />

          <p className="flex-grow w-20 px-2 pr-2 text-xs truncate">
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
            className="justify-end w-5 h-5 ml-auto stroke-2"
            onClick={(e) => {
              e.stopPropagation();
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
      {collapsibleContent === "options" && (
        <OptionsSection
          data={data}
          resetCollapsibleContent={resetCollapsibleContent}
        />
      )}
    </div>
  );
};

const OptionsSection = ({ data, resetCollapsibleContent }) => {
  const {
    setZoomedLayerBbox,
    tableLoaded,
    setTableLoaded,
    layerInfo,
    setLayerInfo,
    mapData,
    layersData,
    removeSelectedLayers,
    removeLayersData,
  } = useMapViewStore();
  const id = data.layerUid;

  const [removeLayerLoading, setRemoveLayerLoading] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const { toast } = useToast();
  const deleteLayerAction = () => {
    async function removeLayerContent() {
      setRemoveLayerLoading(true);
      try {
        const body = {
          layers: [{ layer_uid: data.layerUid }],
          mapUid: mapData.mapUid,
        };

        const response = await fetch("/api/remove-layer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        removeSelectedLayers(data);
        removeLayersData(data);
        toast({ title: "Success Removing Layer", variant: "success" });
        setTimeout(() => {
          setOpenAlertDialog(false);
        }, 500);
        resetCollapsibleContent();
      } catch (error) {
        toast({
          title: "Error removing layer",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Error during fetch:", error.message);
      } finally {
        setRemoveLayerLoading(false);
      }
    }

    removeLayerContent();
  };

  const buttonLists = [
    {
      icon: <ZoomIn className="w-3 h-3 stroke-2" />,
      name: "Zoom to",
      onClick: () => {
        setZoomedLayerBbox(data.layerBbox);
        resetCollapsibleContent();
      },
    },
    {
      icon: <Table className="w-3 h-3 stroke-2" />,
      name: "Show Table",
      onClick: (e) => {
        resetCollapsibleContent();
        handleTableButtonClick(e.currentTarget.name);
      },
    },
    // { // TODO: Fix this rename if the functionality exists
    //   icon: <PencilIcon className="w-3 h-3 stroke-2" />,
    //   name: "Rename",
    //   onClick: null,
    // },
  ];

  const handleTableButtonClick = (key) => {
    if (key == layerInfo.layerUid) {
      setTableLoaded(!tableLoaded);
    } else {
      setTableLoaded(true);
      setTimeout(() => {
        setTableLoaded(false);
      }, 100);
    }
    setLayerInfo(key, data.layerTitle);
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-white border-b border-l border-r rounded-md shadow-md">
      {buttonLists.map((item, index) => (
        <button
          key={`button-${item.name}-${id}`}
          name={id}
          className="flex items-center justify-start gap-2 p-1"
          onClick={item.onClick}
        >
          <span>{item.icon}</span>
          {item.name}
        </button>
      ))}

      {mapData.mapType === "map" && layersData.length > 0 && (
        <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
          <AlertDialogTrigger asChild>
            <button className="flex items-center justify-start gap-2 p-1">
              <span>
                <Trash className="w-3 h-3 stroke-2" />
              </span>
              Remove
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure want delete this layer?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-transparent hover:text-black">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-400"
                onClick={deleteLayerAction}
              >
                {removeLayerLoading ? (
                  <Loader2 className="w-4 h-4 stroke-blackHaze-500 animate-spin" />
                ) : (
                  <span> Continue </span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
