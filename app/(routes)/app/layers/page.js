"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dropzone } from "@/components/ui/dropzone";
import ClientPagination from "@/app/_components/app/client-pagination";
import { useToast } from "@/components/ui/use-toast";
import useLayerStore from "@/helpers/hooks/useLayerStore";

const LayersDashboard = () => {
  const [files, setFiles] = useState([]);
  const { layersData, setLayers } = useLayerStore();
  const [uploadProgress, setUploadProgress] = useState(false);
  const { toast } = useToast();

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

        const mockUser = {
          fullName: "Shadcn",
          avatar: "https://github.com/shadcn.png",
        };

        const IMAGE_BASE_URL = "http://dev3.webgis.co.id/be";

        const mockLayers = temp.map((layers) => {
          return {
            ...layers,
            user: mockUser,
            thumbnail_url: `${IMAGE_BASE_URL}/cms/layer/thumbnail/${layers.thumbnail_url}`,
          };
        });
        setLayers(mockLayers);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }
    getLayersData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  // Function to handle the change in uploaded files
  const handleFileChange = (newState) => {
    setFiles(newState);
    setUploadProgress(true);
  };

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
        setUploadProgress(false); // Set progress to 100 upon completion
      } catch (error) {
        console.error("Error during fetch:", error.message);
        toast({
          title: "ERROR",
          description: error.message,
        });
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

  return (
    <div className="px-6">
      <div className="py-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">+ New Item</Button>
          </DialogTrigger>
          {/* Conditionally render Dropzone based on fileUploaded state */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="pb-2">Upload new layer</DialogTitle>
              <Dropzone
                onChange={handleFileChange}
                className="w-full"
                fileExtension="zip"
                progress={uploadProgress}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {/* Pagination */}
      <ClientPagination data={layersData} />
    </div>
  );
};

export default LayersDashboard;
