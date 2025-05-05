"use client";

import { Button } from "@/components/ui/button";

const MapsDashboard = () => {
  const handleUploadData = async () => {
    try {
      const response = await fetch("/api/get-layers", {
        method: "GET",
      })
    } catch (error) {
      
    }
  }

  return (
    <div>
    <Button className="w-full" onClick={() => handleUploadData()}>
            UploadData
    </Button>
    </div>
  );
};

export default MapsDashboard;
