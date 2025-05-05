import React, { useCallback, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import useLayerManager from "@/helpers/hooks/use-layer-manager";
import useZoomToLayer from "@/helpers/hooks/use-zoom-to-layer";
import usePopUpManager from "@/helpers/hooks/use-popup-manager";
import useHighlightManager from "@/helpers/hooks/use-highlight-manager";
import useMapSidebarStore from "@/helpers/hooks/store/use-map-sidebar-store";
import useMapControlManager from "@/helpers/hooks/use-map-control-manager";
import GeojsonCard from "../geojson-card/geojson-card";
import use3DLayerManager from "@/helpers/hooks/use-3d-layer-manager";
import useMapStyleManager from "@/helpers/hooks/use-map-style-manager";

const MapMain = () => {
  const [bounds, setBounds] = useState({
    top: 68,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [is3DMode, setIs3DMode] = useState(false);

  useLayerManager();
  useZoomToLayer();
  usePopUpManager();
  useHighlightManager();
  useMapControlManager();
  // use3DLayerManager(mapRef, MAPTILER_KEY, is3DMode); // New hook usage
  useMapStyleManager();
  const {
    setMap,
    setMapLoaded,
    setZoomedLayerBbox,
    setCurrentViewBbox,
    mapClicked,
  } = useMapViewStore();

  const {
    showLeftSidebar,
    expandedLeftSidebarContent,
    showRightSidebar,
    expandedRightSidebarContent,
  } = useMapSidebarStore();

  const toggle3DMode = useCallback(() => {
    setIs3DMode((prev) => !prev);
    if (mapRef.current) {
      if (!is3DMode) {
        mapRef.current.setPitch(45);
        mapRef.current.setBearing(-17.6);
      } else {
        mapRef.current.setPitch(0);
        mapRef.current.setBearing(0);
      }
    }
  }, [is3DMode]);

  const calculateBounds = useCallback(() => {
    const parentRect = mapContainerRef.current.getBoundingClientRect(); // Get the parent container's dimensions
    const consistentTop = 68; // Consistent top boundary in pixels

    // Initialize right boundary to be within the parent by default
    let adjustedRight = 0; // Default setting for no sidebar interference

    // Adjust the right boundary based on the right sidebar state
    if (expandedRightSidebarContent && showRightSidebar) {
      adjustedRight = 372; // Both sidebar visible and content expanded
    } else if (showRightSidebar) {
      adjustedRight = 124; // Only sidebar visible
    } else if (expandedRightSidebarContent) {
      adjustedRight = 300; // Only content expanded
    }

    // Initialize left boundary to be within the parent by default
    let adjustedLeft = 0; // Default setting for no sidebar interference

    // Adjust the left boundary based on the left sidebar state
    if (expandedLeftSidebarContent && showLeftSidebar) {
      adjustedLeft = 412; // Both sidebar visible and content expanded
    } else if (showLeftSidebar) {
      adjustedLeft = 172; // Only sidebar visible
    } else if (expandedLeftSidebarContent) {
      adjustedLeft = 300; // Only content expanded
    }

    return {
      left: 0, // Allow full horizontal movement within the parent
      top: parentRect.top - consistentTop + 12, // Fixed top position relative to the parent
      right: parentRect.width - (adjustedRight + adjustedLeft), // Adjusted based on sidebar
      bottom: parentRect.height, // Full height use, no restriction here since only top is set
    };
  }, [
    expandedRightSidebarContent,
    showRightSidebar,
    expandedLeftSidebarContent,
    showLeftSidebar,
  ]);

  useEffect(() => {
    const updateBounds = () => {
      if (mapContainerRef.current) {
        const newBounds = calculateBounds();
        setBounds(newBounds);
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds); // Recalculate bounds on window resize
    return () => window.removeEventListener("resize", updateBounds);
  }, [
    calculateBounds,
    expandedLeftSidebarContent,
    showLeftSidebar,
    expandedRightSidebarContent,
    showRightSidebar,
  ]);

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
            attribution: "&copy; OpenStreetMap Contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm-tiles",
          },
        ],
      },
      center: [118.0148634, -2.548926],
      zoom: 15.5,
      pitch: is3DMode ? 45 : 0,
      bearing: is3DMode ? -17.6 : 0,
      antialias: true,
    });

    setMap(mapRef.current);
    mapRef.current.on("load", () => {
      setMapLoaded(true);
      mapRef.current.getCanvas().style.cursor = "crosshair";
    });

    mapRef.current.on("mouseenter", () => {
      mapRef.current.getCanvas().style.cursor = "crosshair";
    });

    mapRef.current.on("mouseleave", () => {
      mapRef.current.getCanvas().style.cursor = "";
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
  }, [setMap, setMapLoaded, setZoomedLayerBbox, setCurrentViewBbox, is3DMode]);

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      {/* <div className="fixed z-20 top-20 right-5 bg-white p-2 rounded shadow">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={is3DMode}
              onChange={toggle3DMode}
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div
              className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                is3DMode ? "transform translate-x-6" : ""
              }`}
            ></div>
          </div>
          <div className="ml-3 text-gray-700 font-medium">3D Mode</div>
        </label>
      </div> */}
      {mapClicked && (
        <Draggable handle=".handle" bounds={bounds}>
          <div
            className={cn("fixed z-10 top-[68px] left-[60px] handle", {
              "left-[300px]": expandedLeftSidebarContent,
              "left-[172px]": showLeftSidebar,
              "left-[412px]": expandedLeftSidebarContent && showLeftSidebar,
            })}
          >
            <GeojsonCard />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default MapMain;
