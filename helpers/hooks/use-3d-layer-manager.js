// @/helpers/hooks/use-3d-layer-manager.js
import { useEffect, useRef, useState } from "react";
import useMapViewStore from "./store/use-map-view-store";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

const use3DLayerManager = (mapRef, MAPTILER_KEY, is3DMode) => {
  const { data: session } = useSession();

  const {
    mapLoaded,
    map,
    mapData,
    mapLayers,
    refreshLayerOrder,
    addedLayerUids,
  } = useMapViewStore();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const add3DLayer = () => {
      if (!map.getSource("openmaptiles")) {
        map.addSource("openmaptiles", {
          url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
          type: "vector",
        });
      }

      if (!map.getLayer("3d-buildings")) {
        map.addLayer({
          id: "3d-buildings",
          source: "openmaptiles",
          "source-layer": "building",
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "render_height"],
              0,
              "lightgray",
              200,
              "royalblue",
              400,
              "lightblue",
            ],
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              16,
              ["get", "render_height"],
            ],
            "fill-extrusion-base": [
              "case",
              [">=", ["get", "zoom"], 16],
              ["get", "render_min_height"],
              0,
            ],
            "fill-extrusion-opacity": 0.6,
          },
        });
      }
    };

    const remove3DLayer = () => {
      if (map.getLayer("3d-buildings")) {
        map.removeLayer("3d-buildings");
      }
      if (map.getSource("openmaptiles")) {
        map.removeSource("openmaptiles");
      }
    };

    if (is3DMode) {
      map.once("style.load", add3DLayer);
    } else {
      remove3DLayer();
    }

    return () => {
      map.off("style.load", add3DLayer);
    };
  }, [mapRef, MAPTILER_KEY, is3DMode]);
};

export default use3DLayerManager;
