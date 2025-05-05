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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DestructiveDialog from "@/app/_components/shared/DestructiveDialog";
import { Trash2 } from "lucide-react";
import { X } from "lucide-react";
import { PencilIcon } from "lucide-react";
import ChangePropDialog from "../../shared/change-prop-dialog";
import useTableQueryStore from "@/helpers/hooks/store/useTableQueryStore";
import { List } from "lucide-react";

const LayersContent = () => {
  const {
    mapLayers,
    setMapLayers,
    multiSelectedLayers,
    setMultiSelectedLayers,
    setIsLayerReordered,
    toggleRefreshLayerOrder,
  } = useMapViewStore();

  const [enabled, setEnabled] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // This code manages loading animation that will affect drag and drop behaviours
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const resetCtrlPressed = () => {
    setIsCtrlPressed(false);
    setMultiSelectedLayers([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control" || e.key === "Meta") {
        if (multiSelectedLayers.length === 0) {
          setIsCtrlPressed(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    if (multiSelectedLayers.length === 0) {
      setIsCtrlPressed(false);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [setIsCtrlPressed, setMultiSelectedLayers, multiSelectedLayers]);

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(mapLayers);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setMapLayers(reorderedItems);
    toggleRefreshLayerOrder();
    setIsLayerReordered(true);
  };

  if (!enabled) {
    return null;
  }

  if (!mapLayers) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full pr-2 mt-2 overflow-y-auto text-xs bg-nileBlue-50">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppableId">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {isCtrlPressed && multiSelectedLayers?.length > 0 && (
                <MultiLayerSelection resetCtrlPressed={resetCtrlPressed} />
              )}
              {mapLayers.map((layer, index) => (
                <Draggable
                  key={`${layer.layerUid}`}
                  draggableId={`${layer.layerUid}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="px-2 mt-1 mb-4"
                    >
                      <LayersCard layer={layer} isCtrlPressed={isCtrlPressed} />
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

const LayersCard = ({ layer, isCtrlPressed }) => {
  const {
    removeMultiSelectedLayers,
    addMultiSelectedLayers,
    multiSelectedLayers,
    toggleLayerVisibility,
    mapClicked,
    setMapClicked,
    selectedLayer,
    setSelectedLayer,
    changedLayerStyleUid,
    setChangedLayerStyleUid,
  } = useMapViewStore();

  const [collapsibleContent, setCollapsibleContent] = useState("layer");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [multipleSelectedLayerChecked, setMultipleSelectedLayerChecked] =
    useState(false);
  const [dateHash, setDateHash] = useState();

  const [isSquare, setIsSquare] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = layer.legendUrl;
    img.onload = () => {
      if (img.width === img.height) {
        setIsSquare(true);
      }
      setImageLoaded(true);
      setDateHash(Date.now());
    };
  }, [layer.legendUrl, changedLayerStyleUid]);

  useEffect(() => {
    if (multiSelectedLayers) {
      setMultipleSelectedLayerChecked(
        multiSelectedLayers.find(
          (layerData) => layerData.layerUid === layer.layerUid
        )
      );
    }
  }, [layer.layerUid, multiSelectedLayers]);

  const handleHideShowChange = () => {
    if (layer.isShown) {
      toggleLayerVisibility(layer.layerUid, false);
    } else {
      toggleLayerVisibility(layer.layerUid, true);
    }
    if (mapClicked) {
      setMapClicked(false);
      setTimeout(() => {
        setMapClicked(true);
      }, 100);
    }
  };

  const resetCollapsibleContent = () => {
    setCollapsibleContent("layer");
  };

  // Handler to update multi-selected layers based on current state
  const updateMultiSelection = (layer) => {
    const isLayerSelected = multiSelectedLayers.some(
      (layerData) => layerData.layerUid === layer.layerUid
    );

    const action = isLayerSelected
      ? removeMultiSelectedLayers
      : addMultiSelectedLayers;

    action({
      layerUid: layer.layerUid,
      isShown: layer.isShown,
    });
  };

  return (
    <div>
      <TooltipText content={layer.layerTitle} side="top" align="start">
        <div
          className={cn(
            "relative flex items-center h-10 gap-2 px-2 bg-white border rounded-md shadow-md cursor-pointer w-54",
            {
              "outline outline-nileBlue-700": multipleSelectedLayerChecked,
            }
          )}
          onClick={(e) => {
            if (isCtrlPressed) {
              e.stopPropagation();
              updateMultiSelection(layer);
            } else {
              if (selectedLayer?.layerUid === layer.layerUid) {
                setSelectedLayer(null);
              } else {
                setSelectedLayer(layer);
              }
            }
          }}
        >
          <div
            className={cn(
              "absolute top-0 left-0 bottom-0 bg-gableGreen-500 transition-all",
              {
                "w-2 rounded-l-md": selectedLayer?.layerUid === layer.layerUid,
              }
            )}
          />

          <p className="flex-grow w-20 px-2 pr-2 text-xs truncate">
            {layer.layerTitle}
          </p>

          <List
            className="w-3 h-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (collapsibleContent === "layer") {
                setCollapsibleContent(null);
                setImageLoaded(false);
              } else {
                setCollapsibleContent("layer");
              }
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleHideShowChange();
            }}
          >
            {layer.isShown ? (
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
          {!imageLoaded && <Skeleton className="w-full h-5 rounded-full" />}
          <div
            className={isSquare ? "w-5 h-5" : "overflow-y-auto max-h-60 w-full"}
          >
            <img
              key={`${layer.layerUid}-${dateHash}`}
              src={`${layer.legendUrl}?${dateHash}`}
              className="w-fit"
              alt="legend logo"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          </div>
        </div>
      )}
      {collapsibleContent === "options" && (
        <OptionsSection
          layer={layer}
          resetCollapsibleContent={resetCollapsibleContent}
        />
      )}
    </div>
  );
};

const MultiLayerSelection = ({ resetCtrlPressed }) => {
  const {
    multiSelectedLayers,
    mapLayers,
    setMultiSelectedLayers,
    setMapLayers,
    addDeletedLayerUids,
    toggleLayerVisibility,
  } = useMapViewStore();

  const [isShowLayerElements, setIsShowLayerElements] = useState(false);

  // Check
  useEffect(() => {
    const latest = multiSelectedLayers[multiSelectedLayers.length - 1];
    if (latest?.isShown) {
      setIsShowLayerElements(true);
    } else {
      setIsShowLayerElements(false);
    }
  }, [multiSelectedLayers]);

  const deleteLayers = async () => {
    // Filter deleted layers data. Exlude the one who get deleted
    const filteredLayersData = mapLayers.filter(
      (layer) =>
        !multiSelectedLayers.some((item) => item.layerUid === layer.layerUid)
    );

    // Add deleted layer data
    multiSelectedLayers.forEach((layer) => {
      addDeletedLayerUids(layer.layerUid);
    });

    setMapLayers(filteredLayersData);

    resetCtrlPressed();
  };

  const hideShowAction = () => {
    if (isShowLayerElements) {
      // Hide the layers
      multiSelectedLayers.forEach((layer) => {
        // toggleLayerVisibility[layer.layerUid] = false; // Set visibility to false for each layer
        toggleLayerVisibility(layer.layerUid, false);
      });

      // Corrected mapping for tempMultiSelectedLayers
      const tempMultiSelectedLayers = multiSelectedLayers.map((layer) => ({
        ...layer,
        isShown: false,
      }));
      setMultiSelectedLayers(tempMultiSelectedLayers);
    } else {
      // Show the layers
      multiSelectedLayers.forEach((layer) => {
        toggleLayerVisibility(layer.layerUid, false);
      });

      const tempMultiSelectedLayers = multiSelectedLayers.map((layer) => ({
        ...layer,
        isShown: true,
      }));
      setMultiSelectedLayers(tempMultiSelectedLayers);
    }
  };

  return (
    <div className="flex items-center w-full gap-3 px-2 h-9 ">
      <X
        className="w-4 h-4 cursor-pointer"
        onClick={() => setMultiSelectedLayers([])}
      />{" "}
      <div className="flex items-center gap-2">
        <p>{multiSelectedLayers.length}</p>
        <p> selected </p>
      </div>
      <DestructiveDialog
        title="Are you sure you want to delete these layers?"
        actionText="Yes, I'm sure"
        action={() => deleteLayers()}
      >
        <Trash2 className="w-3 h-3 cursor-pointer" />
      </DestructiveDialog>
      <button
        onClick={(e) => {
          hideShowAction();
          e.stopPropagation();
        }}
      >
        {isShowLayerElements ? (
          <Eye className="w-3 h-3" />
        ) : (
          <EyeOff className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};

const OptionsSection = ({ layer, resetCollapsibleContent }) => {
  const {
    tableLoaded,
    layerInfo,
    mapData,
    mapLayers,
    setZoomedLayerBbox,
    setTableLoaded,
    setLayerInfo,
    addDeletedLayerUids,
    removeMapLayers,
  } = useMapViewStore();

  const {
    reloadTable,
    setReloadTable,
    setFtsQuery,
    searchSubmit,
    setSearchSubmit,
  } = useTableQueryStore();

  const id = layer.layerUid;

  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const deleteLayerAction = () => {
    addDeletedLayerUids(layer.layerUid);
    removeMapLayers(layer);
  };

  const highlightLayerAction = async () => {};

  const buttonLists = [
    {
      icon: <ZoomIn className="w-3 h-3 stroke-2" />,
      name: "Zoom to",
      onClick: () => {
        setZoomedLayerBbox(layer.layerBbox);
        resetCollapsibleContent();
      },
    },
    {
      icon: <Table className="w-3 h-3 stroke-2" />,
      name: "Show table",
      onClick: (e) => {
        handleTableButtonClick(e.currentTarget.name);
        resetCollapsibleContent();
      },
    },
  ];

  const handleTableButtonClick = (key) => {
    setFtsQuery(null);
    setReloadTable(true);
    setSearchSubmit(false);
    if (key == layerInfo.layerUid) {
      setTableLoaded(!tableLoaded);
      setReloadTable(!reloadTable);
    } else {
      setTableLoaded(false);
      setTimeout(() => {
        setTableLoaded(true);
      }, 100);
    }
    setLayerInfo(key, layer.layerTitle);
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
      <ChangePropDialog
        changePropType="layer"
        objectUid={layer.layerUid}
        initialTitle={layer.layerTitle}
        initialDescription={layer.layerDescription}
        initialTags={layer.layerTags}
      >
        <button name={id} className="flex items-center justify-start gap-2 p-1">
          <PencilIcon className="w-3 h-3 stroke-2" />
          Change properties
        </button>
      </ChangePropDialog>

      {mapData.mapType === "map" && mapLayers.length > 0 && (
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
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-transparent hover:text-black">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-400"
                onClick={deleteLayerAction}
              >
                <span> Continue </span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
