"use client";

import { Button } from "@/components/ui/button";
import ComposeMapDialog from "./compose-map-dialog";
import { Filter } from "lucide-react";
import { Plus } from "lucide-react";
import { ArrowDownWideNarrow } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dropzone } from "@/components/ui/dropzone";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const LayersButtons = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
      } catch (error) {
        console.error("Error during fetch:", error.message);
        toast({
          title: "ERROR",
          description: error.message,
        });
      } finally {
        setUploadProgress(false); // Reset progress on error
        setOpenDialog(false);
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
    <div className="flex items-center justify-between w-full">
      <Button variant="secondary" className="flex gap-2">
        <Filter className="w-5 h-5" fill="#006236" />
        Filter
      </Button>
      <div className="flex items-center justify-center gap-4">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex gap-2" onClick={() => setOpenDialog(true)}>
              <Plus className="w-5 h-5 stroke-[4px]" fill="white" />
              Add Layers
            </Button>
          </DialogTrigger>
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
        <Button variant="secondary" className="flex gap-2">
          <ArrowDownWideNarrow className="w-5 h-5" fill="#006236" />
          Sort By
        </Button>
      </div>
    </div>
  );
};

export default LayersButtons;
