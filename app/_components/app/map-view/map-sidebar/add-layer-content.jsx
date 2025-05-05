"use client";

import { ArrowDownWideNarrow } from "lucide-react";
import { Search } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import TooltipText from "@/app/_components/shared/tooltip-text";
import { useToast } from "@/components/ui/use-toast";
import useUpdateLayer from "@/helpers/hooks/use-update-layer";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";

const AddLayersContent = () => {
  const { toast } = useToast();
  const { mapLayers } = useMapViewStore();

  const [layers, setLayers] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [refetchLayers, setRefetchLayers] = useState(false);
  const [searchedTitle, setSearchedTitle] = useState(""); // Added state for search term
  const [progressValue, setProgressValue] = useState(0);

  // Define for rendering thumbnails every time page is changed
  useEffect(() => {
    // Define function to get layers API
    async function getLayersData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/get-layers`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json();

        const tempLayers = temp.data.map((data) => {
          return {
            ...data,
            thumbnailUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/be/cms/layer/thumbnail/${data.thumbnailUrl}`,
            legendUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/be/cms/layer/${data.layerUid}/legend`,
            isShown: true,
          };
        });

        const filtered = tempLayers.filter(
          (localLayer) =>
            !mapLayers.some(
              (layerData) => layerData.layerUid === localLayer.layerUid
            )
        );

        setLayers(filtered);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      } finally {
        setContentLoading(false);
      }
    }

    getLayersData().catch(console.error);
  }, [refetchLayers, mapLayers]);

  // remove this useEffect hook if you don't need to do anything with the uploaded files
  useEffect(() => {
    async function postVectorData(formData) {
      const xhr = new XMLHttpRequest();

      // Set the upload progress event listener.
      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
          setProgressValue((event.loaded / event.total) * 85);
        }
      });

      xhr.onload = function () {
        if (xhr.status === 200) {
          setProgressValue(0);
          try {
            const responseData = JSON.parse(xhr.responseText);
            if (responseData.status == "success") {
              toast({
                title: responseData.status,
                description: responseData.msg,
                variant: "success",
              });
            } else {
              toast({
                title: responseData.status,
                description: responseData.msg,
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error("Error during fetch:", error.message);
            toast({
              title: "ERROR",
              description: error.message,
              variant: "destructive",
            });
          } finally {
            setRefetchLayers(!refetchLayers);
            setUploadProgress(false); // Reset progress on error
          }
        } else {
          toast({
            title: "ERROR",
            description: xhr.status,
            variant: "destructive",
          });
        }
      };
      xhr.open(
        "POST",
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/upload-vectordata`
      );
      xhr.send(formData);
    }

    if (files.length > 0) {
      const formData = new FormData();
      formData.append("vector_zip", files[0]);
      postVectorData(formData);
      setFiles([]);
    }
  }, [files, toast]);

  const handleFileChange = (newState) => {
    setFiles(newState);
    setUploadProgress(true);
  };

  const filteredLayers = layers.filter((layer) =>
    layer.layerTitle.toLowerCase().includes(searchedTitle.toLowerCase())
  );

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="w-5 h-5 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2 overflow-y-auto text-xs bg-nileBlue-50">
      <div className="flex flex-col gap-2 p-2 border rounded-lg shadow-md">
        <p className="font-bold"> Upload new layer </p>
        <Dropzone
          onChange={handleFileChange}
          className="flex-col w-full text-[8px]"
          fileExtension="zip"
          progress={uploadProgress}
          resetView={refetchLayers}
          progressValue={progressValue}
        />
      </div>

      <div className="flex items-center gap-2 py-2 pl-2 pr-3 bg-white border rounded-lg">
        <Search className="w-4 h-4" />
        <input
          placeholder="Search for layers"
          className="w-full border-none outline-none"
          value={searchedTitle}
          onChange={(e) => setSearchedTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <p>Items: {filteredLayers.length}</p>
        </div>
        {/* <ArrowDownWideNarrow className="w-4 h-4" /> */}
      </div>

      <div className="flex flex-col gap-4">
        {filteredLayers.map((layer) => (
          <AddLayerCard key={layer.layerUid} layer={layer} />
        ))}
      </div>
    </div>
  );
};

export default AddLayersContent;

const AddLayerCard = ({ layer }) => {
  const { addAddedLayerUids, addMapLayers } = useMapViewStore();
  const addLayerContent = () => {
    addMapLayers(layer);
    addAddedLayerUids(layer.layerUid);
  };

  const generateDate = () => {
    if (layer?.updatedAt) {
      return `Updated: ${dayjs(layer.updatedAt).format("DD/MM/YYYY")}`;
    } else {
      return `Created: ${dayjs(layer.createdAt).format("DD/MM/YYYY")}`;
    }
  };
  return (
    <div className="flex flex-col gap-4 p-2 border rounded-lg shadow-md">
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col w-full gap-1">
          <AspectRatio ratio={450 / 200} className="flex items-center">
            <img
              src={layer.thumbnailUrl}
              alt="map image"
              className="rounded-md "
            />
          </AspectRatio>
          <TooltipText content={layer.layerTitle} side="top" align="start">
            <p className="w-full text-base font-bold truncate cursor-pointer">
              {layer.layerTitle}
            </p>
          </TooltipText>
          <p>
            by <span className="font-bold">{layer.creator.fullName}</span>
          </p>
          <p>{generateDate()}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <PlusCircle
          className="w-4 h-4 cursor-pointer"
          onClick={addLayerContent}
        />
      </div>
    </div>
  );
};
