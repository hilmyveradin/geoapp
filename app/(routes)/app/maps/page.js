"use client";

import ClientPagination from "@/app/_components/app/client-pagination";
import MapsButtons from "@/app/_components/app/map-buttons";
import DestructiveDialog from "@/app/_components/shared/DestructiveDialog";
import ReusableAlertDialog from "@/app/_components/shared/DestructiveDialog";
import { useToast } from "@/components/ui/use-toast";
import useCardStore from "@/helpers/hooks/store/useCardStore";
import useRefetchStore from "@/helpers/hooks/store/useRefetchStore";
import { X } from "lucide-react";
import { Share2Icon } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const MapsDashboard = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [mapsData, setMapsData] = useState([]);
  const { refetchMaps, toggleRefetchMaps } = useRefetchStore();
  const { setIsCtrlPressed, selectedCards, clearSelection, isCtrlPressed } =
    useCardStore();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) setIsCtrlPressed(true);
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control" || e.key === "Meta") {
        setIsCtrlPressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [setIsCtrlPressed]);

  useEffect(() => {
    return clearSelection();
  }, [clearSelection]);

  useEffect(() => {
    // Define function to get layers API
    async function getMapsData() {
      try {
        const response = await fetch("/api/get-maps", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const temp = await response.json();

        const tempData = temp.data
          .map((data) => {
            return {
              ...data,
              cardType: "map",
              cardTitle: data.mapTitle,
              cardUid: data.mapUid,
              thumbnailUrl: `http://dev3.webgis.co.id/be/cms/map/thumbnail/${data.thumbnailUrl}`,
            };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMapsData(tempData);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      } finally {
        setPageLoading(false);
      }
    }

    getMapsData()
      // make sure to catch any error
      .catch(console.error);
  }, [refetchMaps]);

  const deleteMaps = async () => {
    const mapUids = selectedCards.map((e) => ({ map_uid: e }));
    try {
      const response = await fetch("/api/delete-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapUids: mapUids }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({ title: "Success deleting maps", variant: "success" });
      toggleRefetchMaps();
      clearSelection();
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full px-8 mt-4">
      <div className="mb-4">
        {selectedCards.length > 0 ? (
          <div className="flex items-center w-full gap-3 h-9">
            <X
              className="w-4 h-4 cursor-pointer"
              onClick={() => clearSelection()}
            />{" "}
            <div className="flex items-center gap-2">
              <p>{selectedCards.length}</p>
              <p> selected </p>
            </div>
            <DestructiveDialog
              title="Are you sure you want to delete these maps?"
              description="This action cannot be undone"
              actionText="Yes, I'm sure"
              action={() => deleteMaps()}
            >
              <Trash2 className="w-4 h-4 cursor-pointer" />
            </DestructiveDialog>
            <Share2Icon className="w-4 h-4 cursor-pointer" />
          </div>
        ) : (
          <MapsButtons />
        )}
      </div>
      {/* Pagination */}
      {mapsData.length > 0 ? (
        <ClientPagination data={mapsData} />
      ) : (
        <div className="flex items-center justify-center w-full h-96">
          <p> You do not have any maps. Add a new one! </p>
        </div>
      )}
    </div>
  );
};

export default MapsDashboard;
