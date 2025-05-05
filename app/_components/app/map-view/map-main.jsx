"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS
import useMapViewStore from "@/helpers/hooks/useMapViewStore";

const MapMain = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const { selectedLayers } = useMapViewStore();

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            // attribution: "©️ OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles-layer",
            type: "raster",
            source: "osm-tiles",
          },
        ],
      },
      center: [60, 70], // starting position
      zoom: 2, // starting zoom
    });

    // mapRef.current.addControl(new maplibregl.NavigationControl());

    return () => mapRef.current.remove(); // Cleanup on unmount
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapMain;
