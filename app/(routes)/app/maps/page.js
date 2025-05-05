"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Dropzone } from '@/components/ui/dropzone';

const MapsDashboard = () => {
  const [layersData, setLayersData] = useState([])
  const [files, setFiles] = useState([]);

  // Define image url since it is a public link
  // If we use fetch, there will be too many
  // Async handling, and the thumbnail image is public
  const IMAGE_BASE_URL = "http://dev3.webgis.co.id/be"

  // Define for rendering thumbnails every time page is changed
  useEffect(() => {
    // Define function to get layers API
    async function getLayersData() {
      try {
        const response = await fetch("/api/get-layers", {
          method: "GET",
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json()
        setLayersData(temp)
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }
    getLayersData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  // TODO: Create upload layer function handler
  // Function to handle the change in uploaded files
  const handleFileChange = (newState) => {
    setFiles(newState);
  };

  // remove this useEffect hook if you don't need to do anything with the uploaded files
  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <div className="ml-20">
      {/* TODO: Add Upload Layers Button */}
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
      <div className="grid grid-rows-2 grid-cols-3 gap-x-2 gap-y-3 ">
        {/* Create a loop to render every thumbnail image */}
        {/* TODO: Add Pagination Handling */}
        {layersData.slice(0, 6).map((layersData) => (
          // Define key so each Card has unique id
          <Card key={layersData.layer_id}>
            <CardContent className="p-2 pt-6">
              <Image 
                src={`${IMAGE_BASE_URL}/gs/thumbnail/${layersData.thumbnail_url}`}
                width={350}
                height={350}
                alt="Thumbnail"
              />
            </CardContent>
            {/* Card layer name and creator name */}
            <CardHeader className="p-2">
              <h3 className={cn("font-semibold overflow-x-auto")}>{layersData.layer_title}</h3>
              <CardDescription>{layersData.creator}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MapsDashboard;
