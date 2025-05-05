import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { useShallow } from "zustand/react/shallow";
import useLayerManager from "@/helpers/hooks/useLayerManager";

const MapMain = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useLayerManager();

  const { setMap, setMapLoaded } = useMapViewStore();

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
            attribution: "©️ OpenStreetMap contributors",
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
      // Indonesian center latitude and longitude
      center: [118.0148634, -2.548926],
      zoom: 4,
    });

    setMap(mapRef.current);
    mapRef.current.addControl(new maplibregl.NavigationControl());
    mapRef.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      setMapLoaded(false);
      setMap(null);
    };
  }, [setMap, setMapLoaded]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapMain;
