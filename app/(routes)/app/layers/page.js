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

const LayersDashboard = () => {
  const [files, setFiles] = useState([]);
  const [layersData, setLayersData] = useState([]);

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
        setLayersData(temp);
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
        console.log(temp);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("vector_zip", files[0]);
      postVectorData(formData);
    }
  }, [files]);

  return (
    <div className="px-6">
      <div className="py-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">+ New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="pb-2">New Item</DialogTitle>
              <Dropzone
                onChange={handleFileChange}
                className="w-full"
                fileExtension="zip"
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
