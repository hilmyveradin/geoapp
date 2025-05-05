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
      image: "/images/basemaps/osm.png",
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
      image: "/images/basemaps/satellite.png",
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
    },
    {
      name: "Dark",
      image: "/images/basemaps/dark.png",
      style: `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_KEY}`,
    },
    {
      name: "3D Buildings",
      image: "/images/basemaps/3d.png",
      style: threeDStyle,
    },
    {
      name: "Esri World Topo",
      image: "/images/basemaps/esri-topo.png",
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
      <Image
        src={image}
        alt={name}
        width={50}
        height={50}
        className="rounded-md"
      />
      <span className="font-medium">{name}</span>
    </div>
  );
};

export default BaseMapContent;
