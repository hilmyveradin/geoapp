import React from "react";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import Image from "next/image";

const BaseMapContent = () => {
  const { setMapStyle } = useMapViewStore();

  const MAPTILER_KEY = "OFfSxrBgH19zr7dfnSMK";

  const threeDStyle = {
    version: 8,
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap Contributors",
      },
      openmaptiles: {
        type: "vector",
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
      },
    },
    layers: [
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm-tiles",
        minzoom: 0,
        maxzoom: 19,
      },
      {
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
      },
    ],
  };

  const mapChoices = [
    {
      name: "OpenStreetMap",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/osm-basemap.png`,
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
    },
    {
      name: "Satellite",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/satellite-basemap.png`,
      style: {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: [
              `https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
            ],
            tileSize: 256,
            maxzoom: 22,
            attribution: "© MapTiler © OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "satellite",
            type: "raster",
            source: "satellite-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
    },

    {
      name: "Dark",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/dark-basemap.png`,
      style: {
        version: 8,
        sources: {
          "dark-tiles": {
            type: "raster",
            tiles: [
              `https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
            ],
            tileSize: 256,
            attribution: "© MapTiler © OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "dark",
            type: "raster",
            source: "dark-tiles",
          },
        ],
      },
    },
    {
      name: "3D Buildings",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/3d-basemap.png`,
      style: threeDStyle,
    },
    {
      name: "Esri World Topo",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/esri-world-topo-basemap.png`,
      style: {
        version: 8,
        sources: {
          esri: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Tiles &copy; Esri",
          },
        },
        layers: [
          {
            id: "esri",
            type: "raster",
            source: "esri",
          },
        ],
      },
    },
    {
      name: "Google Imagery With Rain Viewer",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/rain-viewer-basemap.png`,
      style: {
        version: 8,
        sources: {
          "google-satellite": {
            type: "raster",
            tiles: ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
            tileSize: 256,
            attribution: "© Google",
          },
          "rain-viewer": {
            type: "raster",
            tiles: [
              "https://tilecache.rainviewer.com/v2/radar/{time}/256/{z}/{x}/{y}/2/1_1.png",
            ],
            tileSize: 256,
            attribution: "© RainViewer",
          },
        },
        layers: [
          {
            id: "google-satellite",
            type: "raster",
            source: "google-satellite",
            minzoom: 0,
            maxzoom: 19,
          },
          {
            id: "rain-viewer",
            type: "raster",
            source: "rain-viewer",
            paint: {
              "raster-opacity": 0.7,
            },
          },
        ],
      },
    },
    {
      name: "Google Maps",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/google-maps-basemap.png`,
      style: {
        version: 8,
        sources: {
          "google-maps": {
            type: "raster",
            tiles: ["https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"],
            tileSize: 256,
            attribution: "© Google",
          },
        },
        layers: [
          {
            id: "google-maps",
            type: "raster",
            source: "google-maps",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
    },
    {
      name: "Google Terrain",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/google-maps-terrain-basemap.png`,
      style: {
        version: 8,
        sources: {
          "google-terrain": {
            type: "raster",
            tiles: ["https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"],
            tileSize: 256,
            attribution: "© Google",
          },
        },
        layers: [
          {
            id: "google-terrain",
            type: "raster",
            source: "google-terrain",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
    },
    {
      name: "Dark Gray Canvas",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/dark-canvas-basemap.png`,
      style: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`,
    },
    {
      name: "Bing Map Aerial",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/bing-basemap.png`,
      style: {
        version: 8,
        sources: {
          "bing-aerial": {
            type: "raster",
            tiles: [
              "https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=1",
            ],
            tileSize: 256,
            attribution: "© Microsoft",
          },
        },
        layers: [
          {
            id: "bing-aerial",
            type: "raster",
            source: "bing-aerial",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
    },
    {
      name: "Bing Map Hybrid",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/bing-map-hybrid-basemap.png`,
      style: {
        version: 8,
        sources: {
          "bing-hybrid": {
            type: "raster",
            tiles: [
              "https://ecn.t3.tiles.virtualearth.net/tiles/h{quadkey}.jpeg?g=1",
            ],
            tileSize: 256,
            attribution: "© Microsoft",
          },
        },
        layers: [
          {
            id: "bing-hybrid",
            type: "raster",
            source: "bing-hybrid",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
    },
    {
      name: "Bing Map Road",
      image: `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/basemaps/bing-road-basemap.png`,
      style: {
        version: 8,
        sources: {
          "bing-road": {
            type: "raster",
            tiles: [
              "https://ecn.t3.tiles.virtualearth.net/tiles/r{quadkey}.jpeg?g=1",
            ],
            tileSize: 256,
            attribution: "© Microsoft",
          },
        },
        layers: [
          {
            id: "bing-road",
            type: "raster",
            source: "bing-road",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
    },
    {
      name: "Oceans",
      image: `/basemaps/ocean-basemap.png`,
      style: `https://api.maptiler.com/maps/ocean/style.json?key=${MAPTILER_KEY}`,
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-2 overflow-y-auto text-xs bg-nileBlue-50">
      <div className="flex flex-col gap-4">
        {mapChoices.map((map, index) => (
          <BaseMapCard
            key={index}
            name={map.name}
            image={map.image}
            onClick={() => setMapStyle(map.style)}
          />
        ))}
      </div>
    </div>
  );
};

const BaseMapCard = ({ name, image, onClick }) => {
  return (
    <div
      className="flex items-center gap-2 p-2 bg-white rounded-md shadow cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <img src={image} alt={name} className="rounded-md w-[100px] h-20" />
      <span className="font-medium">{name}</span>
    </div>
  );
};

export default BaseMapContent;
