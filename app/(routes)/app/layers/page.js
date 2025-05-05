"use client";

import { useEffect, useState } from "react";
import ClientPagination from "@/app/_components/app/client-pagination";
import LayersButtons from "@/app/_components/app/layer-buttons";
import { Loader2 } from "lucide-react";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";

import { Share2Icon } from "lucide-react";
import { Trash2 } from "lucide-react";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useCardStore from "@/helpers/hooks/store/use-card-store";
import DestructiveDialog from "@/app/_components/shared/destructive-dialog";
import useSearchQueryStore from "@/helpers/hooks/store/use-search-query-store";

const LayersDashboard = () => {
  const [mapLayers, setLayers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { refetchLayers, toggleRefetchLayers } = useRefetchStore();
  const { setIsCtrlPressed, selectedCards, clearSelection, isCtrlPressed } =
    useCardStore();
  const { searchedTitle, setSearchedTitle } = useSearchQueryStore(); // Added state for search term

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

  // Define for rendering thumbnails every time page is changed
  useEffect(() => {
    // Define function to get layers API
    async function getLayersData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/get-layers`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json();

        const tempLayers = temp.data
          .map((data) => {
            return {
              ...data,
              cardType: "layer",
              cardTitle: data.layerTitle,
              cardDescription: data.layerDescription,
              cardTags: data.layerTags,
              cardUid: data.layerUid,
              thumbnailUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/cms/layer/thumbnail/${data.thumbnailUrl}`,
            };
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setLayers(tempLayers);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      } finally {
        setPageLoading(false);
      }
    }

    getLayersData();
  }, [refetchLayers]);

  useEffect(() => {
    return () => {
      setSearchedTitle("");
    };
  }, [setSearchedTitle]);

  const deleteLayers = async () => {
    const layerUids = selectedCards.map((e) => ({ layer_uid: e }));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/delete-layer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layerUids: layerUids }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({ title: "Success deleting layers", variant: "success" });
      toggleRefetchLayers();
      clearSelection();
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  const filteredLayers = mapLayers.filter((layer) =>
    layer.layerTitle.toLowerCase().includes(searchedTitle.toLowerCase())
  );

  return (
    <div className="w-full h-full px-8 mt-4">
      <div className="mb-4">
        <LayersButtons />
      </div>
      {/* Pagination */}
      {filteredLayers.length > 0 ? (
        <ClientPagination data={filteredLayers} />
      ) : (
        <div className="flex items-center justify-center w-full h-96">
          <p>
            {" "}
            <p> You do not have any layers data. Add a new one! </p>
          </p>
        </div>
      )}
    </div>
  );
};

export default LayersDashboard;
