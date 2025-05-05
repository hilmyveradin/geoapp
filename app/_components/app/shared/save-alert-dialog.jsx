"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import TooltipText from "@/app/_components/shared/tooltip-text";

const SaveAlertDialog = ({ children }) => {
  const {
    mapData,
    addedLayerUids,
    deletedLayerUids,
    mapLayers,
    isLayerReordered,
    resetDeletedLayerUids,
    resetAddedLayerUids,
    setIsLayerReordered,
    currentViewBbox,
  } = useMapViewStore();

  const { toggleRefetchMaps } = useRefetchStore();
  const { toast } = useToast();
  const [alertOpen, setAlertOpen] = useState(false);
  const [submittingData, setSubmittingData] = useState(false);

  const addMapLayers = async () => {
    if (!addedLayerUids || addedLayerUids?.length === 0) {
      return Promise.resolve();
    }
    return fetch(
      `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/add-layer?mapUid=${mapData.mapUid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addedLayerUids }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast({ title: "Success Adding Layer", variant: "success" });
        resetAddedLayerUids();
      })
      .catch((error) => {
        toast({
          title: "Error adding layer",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Error during fetch:", error.message);
        throw error; // Ensure the promise is rejected by throwing the error
      });
  };

  const deleteMapLayers = async () => {
    if (!deletedLayerUids || deletedLayerUids?.length === 0) {
      return Promise.resolve();
    }

    return fetch(
      `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/delete-layer?mapUid=${mapData.mapUid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletedLayerUids }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast({ title: "Success Deleting Layer", variant: "success" });
        resetDeletedLayerUids();
      })
      .catch((error) => {
        toast({
          title: "Error deleting layer",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Error during fetch:", error.message);
        throw error; // Ensure the promise is rejected by throwing the error
      });
  };

  const reorderMapLayers = async () => {
    const isLayerNotReorderd = !isLayerReordered;

    if (isLayerNotReorderd) {
      return Promise.resolve();
    }

    const reorderedLayerUids = mapLayers.map((layer) => {
      return layer.layerUid;
    });

    return fetch(
      `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/reorder-layer?mapUid=${mapData.mapUid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorderedLayerUids }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast({ title: "Success Reordering Layer", variant: "success" });
        setIsLayerReordered(false);
      })
      .catch((error) => {
        toast({
          title: "Error reordering layer",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Error during fetch:", error.message);
        throw error; // Ensure the promise is rejected by throwing the error
      });
  };
  const saveViewBbox = async () => {
    if (!currentViewBbox || !mapData) {
      return Promise.resolve();
    }

    const changeMapProp = () =>
      fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/change-prop?mapUid=${mapData.mapUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ view_bbox: currentViewBbox }),
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toggleRefetchMaps();
        toast({ title: "Success Update Map Bbox", variant: "success" });
        return response.json();
      });

    const changeLayerProp = () =>
      fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/change-prop?layerUid=${mapData.mapUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ view_bbox: currentViewBbox }),
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast({ title: "Success Change Layer Properties", variant: "success" });
        return response.json();
      });

    try {
      if (mapData.mapType === "map") {
        await changeMapProp();
      } else {
        await changeLayerProp();
      }
    } catch (error) {
      toast({
        title: "Error updating map view properties",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const saveMapChanges = () => {
    setSubmittingData(true);

    Promise.all([
      addMapLayers(),
      deleteMapLayers(),
      reorderMapLayers(),
      saveViewBbox(),
    ])
      .then(() => {
        toast({ title: "All changes saved successfully!", variant: "success" });
        setAlertOpen(false); // Close the alert only when all promises resolve
      })
      .catch((error) => {
        console.error("Error during operations:", error);
        toast({
          title: "Error saving changes",
          description: "Not all changes were saved successfully.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setSubmittingData(false);
      });
  };

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <TooltipText content="Save Map" side="right" align="start">
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      </TooltipText>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure want to save the changes?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            className="hover:bg-red-500"
            variant="outline"
            onClick={() => setAlertOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
            onClick={saveMapChanges}
            disabled={submittingData}
          >
            {submittingData ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
                <span className="font-bold">Please wait</span>
              </span>
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SaveAlertDialog;
