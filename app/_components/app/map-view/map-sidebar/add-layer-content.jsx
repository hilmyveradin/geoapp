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
import TooltipText from "@/app/_components/shared/tooltipText";
import { useToast } from "@/components/ui/use-toast";

const LayersContent = ({ layers }) => {
  return (
    <div className="flex flex-col gap-4">
      {layers.map((item) => (
        <AddLayerCard key={item.layerUid} data={item} />
      ))}
    </div>
  );
};

const AddLayerCard = ({ data }) => {
  const generateDate = () => {
    if (data?.updatedAt) {
      return `Updated: ${dayjs(data.updatedAt).format("DD/MM/YYYY")}`;
    } else {
      return `Created: ${dayjs(data.createdAt).format("DD/MM/YYYY")}`;
    }
  };
  return (
    <div className="flex flex-col gap-4 p-2 border rounded-lg shadow-md">
      <div className="flex items-center justify-center gap-3">
        <div className="w-24">
          <AspectRatio ratio={450 / 200} className="flex items-center">
            <img src={data.thumbnailUrl} alt="map image" className="w-24" />
          </AspectRatio>
        </div>
        <div className="flex flex-col gap-1">
          <TooltipText content={data.layerTitle} side="top" align="start">
            <p className="w-32 font-bold truncate cursor-pointer">
              {data.layerTitle}
            </p>
          </TooltipText>
          <p>
            {data.layerDataModel} by <span>{data.creator.fullName}</span>
          </p>
          <p>{generateDate()}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <PlusCircle className="w-4 h-4 cursor-pointer" />
      </div>
    </div>
  );
};

const AddLayersContent = () => {
  const { toast } = useToast();
  const [layers, setLayers] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [refetchLayers, setRefetchLayers] = useState(false);

  // Define for rendering thumbnails every time page is changed
  useEffect(() => {
    // Define function to get layers API
    async function getLayersData() {
      try {
        const response = await fetch("/api/get-layers", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json();

        const tempLayers = temp.data.map((data) => {
          return {
            ...data,
            thumbnailUrl: `http://dev3.webgis.co.id/be/cms/layer/thumbnail/${data.thumbnailUrl}`,
          };
        });

        setLayers(tempLayers);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      } finally {
        setContentLoading(false);
      }
    }

    getLayersData().catch(console.error);
  }, [refetchLayers]);

  // remove this useEffect hook if you don't need to do anything with the uploaded files
  useEffect(() => {
    async function postVectorData(formData) {
      try {
        const response = await fetch("/api/upload-vectordata", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json();
        toast({
          title: temp.status,
          description: temp.msg,
        });
      } catch (error) {
        console.error("Error during fetch:", error.message);
        toast({
          title: "ERROR",
          description: error.message,
        });
      } finally {
        setRefetchLayers((prev) => !prev);
        setUploadProgress(false); // Reset progress on error
      }
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

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="w-5 h-5 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2 overflow-y-auto text-xs">
      <div className="flex flex-col gap-2 p-2 border rounded-lg shadow-md">
        <p className="font-bold"> Upload new layer </p>
        <Dropzone
          onChange={handleFileChange}
          className="flex-col w-full text-[8px]"
          fileExtension="zip"
          progress={uploadProgress}
          resetView={refetchLayers}
        />
      </div>

      <div className="flex items-center gap-2 py-2 pl-2 pr-3 bg-white border rounded-lg">
        <Search className="w-4 h-4" />
        <input
          placeholder="Search for layers"
          className="w-full border-none outline-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <p>Items: {layers.length}</p>
        </div>
        <ArrowDownWideNarrow className="w-4 h-4" />
      </div>
      <LayersContent layers={layers} />
    </div>
  );
};

export default AddLayersContent;
