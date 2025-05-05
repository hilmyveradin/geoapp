import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import useLayerManager from "@/helpers/hooks/useLayerManager";
import useZoomToLayer from "@/helpers/hooks/useZoomToLayer";
import usePopUpManager from "@/helpers/hooks/usePopUpManager";

const MapMain = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useLayerManager();
  useZoomToLayer();
  usePopUpManager();

  const { setMap, setMapLoaded, setZoomedLayerBbox, setCurrentViewBbox } =
    useMapViewStore();

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
    const navControl = new maplibregl.NavigationControl();
    navControl._container.className += " absolute right-12"; // Tailwind class for right 100px
    mapRef.current.addControl(navControl, "top-right");
    mapRef.current.on("load", () => {
      setMapLoaded(true);
      mapRef.current.getCanvas().style.cursor = "crosshair"; // Set the cursor to crosshair
    });

    mapRef.current.on("mouseenter", () => {
      mapRef.current.getCanvas().style.cursor = "crosshair"; // Change cursor on mouse enter
    });

    mapRef.current.on("mouseleave", () => {
      mapRef.current.getCanvas().style.cursor = ""; // Reset cursor on mouse leave
    });

    const updateBbox = () => {
      const bounds = mapRef.current.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const bboxArray = [sw.lng, sw.lat, ne.lng, ne.lat];
      setCurrentViewBbox(bboxArray);
    };

    mapRef.current.on("moveend", updateBbox);

    return () => {
      setMapLoaded(false);
      setMap(null);
      setZoomedLayerBbox(null);
    };
  }, [setMap, setMapLoaded, setZoomedLayerBbox, setCurrentViewBbox]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapMain;
