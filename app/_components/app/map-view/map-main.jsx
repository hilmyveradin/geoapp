import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { useShallow } from "zustand/react/shallow";
import useLayerManager from "@/helpers/hooks/useLayerManager";

const MapMain = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [centerLat] = useState(1);
  const [centerLong] = useState(1);

  useLayerManager();

  const { setMap, setMapLoaded } = useMapViewStore(
    useShallow((state) => ({
      selectedLayers: state.selectedLayers,
      setMap: state.setMap,
      setMapLoaded: state.setMapLoaded,
    }))
  );

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
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
        center: [centerLat, centerLong], // This will be updated below
        zoom: 8, // This might be adjusted based on the BBoxes
      });

      setMap(mapRef.current);
      mapRef.current.addControl(new maplibregl.NavigationControl());
      mapRef.current.on("load", () => {
        setMapLoaded(true);
      });
    }

    return () => {
      if (mapRef.current && mapRef.current.remove()) {
        setMapLoaded(false);
      }
    };
  }, [centerLat, centerLong, setMap, setMapLoaded]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapMain;
