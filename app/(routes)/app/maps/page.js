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
import { cn } from "@/lib/utils"

const MapsDashboard = () => {
  const [layersData, setLayersData] = useState([])
  const IMAGE_BASE_URL = "http://dev3.webgis.co.id/be"
  let curTotalPages = 0
  const numOfThumbnailsPerPage = 6

  const handleUploadData = async () => {
    // try {
    //   const response = await fetch("/api/get-layers", {
    //     method: "GET",
    //   })
    // } catch (error) {
      
    // }
  }

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
        curTotalPages = Math.ceil(layersData.length / numOfThumbnailsPerPage)
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }
    getLayersData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  return (
    <div className>
      <div className="grid grid-rows-2 grid-cols-3 gap-x-2 gap-y-3 ml-20">
        {layersData.slice(0, 6).map((layersData) => (
          <Card>
            <CardContent className="p-2 pt-6">
              <Image 
                src={`${IMAGE_BASE_URL}/gs/thumbnail/${layersData.thumbnail_url}`}
                width={350}
                height={350}
                alt="Thumbnail"
              />
            </CardContent>
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
