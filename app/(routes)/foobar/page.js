"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Define your specific bounding box [minLng, minLat, maxLng, maxLat]
  const layerBbox = [
    110.65032196044922, -7.593528747558594, 110.72122192382812,
    -7.5570068359375,
  ];

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
      center: [60, 70], // starting position
      zoom: 2, // starting zoom
    });

    mapRef.current.addControl(new maplibregl.NavigationControl());

    mapRef.current.on("load", () => {
      addLayerAndSources();
      mapRef.current.on("move", () => checkLayerVisibility());
    });

    return () => mapRef.current.remove(); // Cleanup on unmount
  }, []);

  const checkLayerVisibility = () => {
    const mapBounds = mapRef.current.getBounds();
    console.log("MAP BOUNDS: ", mapBounds.getWest());
    // Check if the map view is within the specified bounding box
    if (
      mapBounds.getWest() > layerBbox[0] &&
      mapBounds.getSouth() > layerBbox[1] &&
      mapBounds.getEast() < layerBbox[2] &&
      mapBounds.getNorth() < layerBbox[3]
    ) {
      // If within the bounding box, set the layer to visible
      mapRef.current.setLayoutProperty("testing", "visibility", "visible");
    } else {
      // If outside the bounding box, set the layer to hidden
      mapRef.current.setLayoutProperty("testing", "visibility", "none");
    }
  };

  const addLayerAndSources = () => {
    if (mapRef.current.getLayer("testing") === undefined) {
      mapRef.current.addSource("testSource", {
        type: "raster",
        tiles: [
          "http://103.6.53.254:11790/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=geocms%3A_33b1_5rd_ln_sr_energi_kecamatansawit_2021_aspbq&bbox=110.65032196044922%2C-7.593528747558594%2C110.72122192382812%2C-7.5570068359375&width=768&height=395&srs=EPSG%3A4326&styles=&format=image%2Fpng",
        ],
        maxZoom: 40,
      });

      mapRef.current.addLayer({
        id: "testing",
        type: "raster",
        source: "testSource",
        paint: {},
        layout: {
          visibility: "none",
        },
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-blue-300">
      <div ref={mapContainerRef} className="w-1/2 h-1/2" />
    </div>
  );
};

export default MapComponent;
