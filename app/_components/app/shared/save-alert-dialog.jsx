"use client";

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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { useState } from "react";

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
  } = useMapViewStore();
  const { toast } = useToast();
  const [alertOpen, setAlertOpen] = useState(false);

  const addMapLayers = async () => {
    if (addedLayerUids.length === 0) {
      return;
    }

    try {
      const body = {
        addedLayerUids,
      };

      const response = await fetch(
        `/api/maps/add-layer?mapUid=${mapData.mapUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({ title: "Success Adding Layer", variant: "success" });
      resetAddedLayerUids();
    } catch (error) {
      toast({
        title: "Error adding layer",
        description: "Please try again",
        variant: "destructive",
      });
      console.error("Error during fetch:", error.message);
    }
  };

  const deleteMapLayers = async () => {
    if (deletedLayerUids.length === 0) {
      return;
    }

    try {
      const body = {
        deletedLayerUids,
      };

      const response = await fetch(
        `/api/maps/delete-layer?mapUid=${mapData.mapUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({ title: "Success Deleting Layer", variant: "success" });
      resetDeletedLayerUids();
    } catch (error) {
      toast({
        title: "Error adding layer",
        description: "Please try again",
        variant: "destructive",
      });
      console.error("Error during fetch:", error.message);
    }
  };

  const reorderMapLayers = async () => {
    const isLayerNotReorderd = !isLayerReordered;

    if (isLayerNotReorderd) {
      return;
    }

    try {
      const reorderedLayerUids = mapLayers.map((layer) => {
        return layer.layerUid;
      });

      debugger;

      const body = {
        reorderedLayerUids,
      };

      const response = await fetch(
        `/api/maps/reorder-layer?mapUid=${mapData.mapUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({ title: "Success Reordering Layer", variant: "success" });
      // setRefetchMapLayers(!refetchMapLayers);
      setIsLayerReordered(false);
    } catch (error) {
      toast({
        title: "Error adding layer",
        description: "Please try again",
        variant: "destructive",
      });
      console.error("Error during fetch:", error.message);
    }
  };

  const saveMapChanges = () => {
    // Add layer
    addMapLayers();

    // Remove Layer
    deleteMapLayers();

    // Reorder Layer
    reorderMapLayers();

    setAlertOpen(false);
  };

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
          <Button onClick={saveMapChanges}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SaveAlertDialog;
