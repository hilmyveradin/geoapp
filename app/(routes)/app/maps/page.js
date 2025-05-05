"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const MapsDashboard = () => {

  const [layers, setLayers] = useState([])
  const [curPage, setCurPage] = useState(1)

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
        const layersData = await response.json()
        // set layers data globally
        setLayers(layersData)
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }
    // Call API only when layers is not fetched
    if (layers.length == 0) {
      getLayersData()
        // make sure to catch any error
        .catch(console.error)
    }
    else {
      const startIdx = layers.length / 6 
    }

  }, [curPage])


  return (
    <div>
      CI-CD berhasil
    </div>
  );
};

export default MapsDashboard;
