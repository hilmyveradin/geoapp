"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Plus, Search } from "lucide-react";
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
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";
import useSearchQueryStore from "@/helpers/hooks/store/use-search-query-store";
import useUserStore from "@/helpers/hooks/store/use-user-store";

const LayersButtons = () => {
  const { isAdmin, isEditor } = useUserStore();
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { toggleRefetchLayers } = useRefetchStore();
  const [progressValue, setProgressValue] = useState(0);
  const { searchedTitle, setSearchedTitle } = useSearchQueryStore(); // Added state for search term

  const handleFileChange = (newState) => {
    setFiles(newState);
    setUploadProgress(true);
  };

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
            toggleRefetchLayers();
          } catch (error) {
            console.error("Error during fetch:", error.message);
            toast({
              title: "ERROR",
              description: error.message,
              variant: "destructive",
            });
          } finally {
            setUploadProgress(false); // Reset progress on error
            setOpenDialog(false);
          }
        } else {
          console.log("not 200");
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
  }, [files, toast, toggleRefetchLayers]);

  return (
    <div className="flex items-center justify-between w-full">
      {/*TODO: Delete this later */}
      {/* <Button variant="secondary" className="flex gap-2">
        <Filter className="w-5 h-5" />
        Filter
      </Button> */}
      <div className="flex justify-center w-full">
        {/* <div className="flex items-center gap-2 py-2 pl-2 pr-3 mr-3 bg-white rounded-lg w-full">
          <Search className="w-4 h-4" />
          <input
            placeholder="Search for layers"
            className="w-full border-none outline-none"
            value={searchedTitle}
            onChange={(e) => setSearchedTitle(e.target.value)}
          />
        </div> */}
      </div>
      <div className="flex items-center justify-center gap-4">
        {isAdmin ||
          (isEditor && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  className="flex gap-2"
                  onClick={() => setOpenDialog(true)}
                >
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
                    progressValue={progressValue}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        {/* <Button variant="secondary" className="flex gap-2">
            <ArrowDownWideNarrow className="w-5 h-5" />
            Sort By
          </Button> */}
      </div>
    </div>
  );
};

export default LayersButtons;
