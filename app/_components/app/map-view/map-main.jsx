// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS
// import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
// import { useShallow } from "zustand/react/shallow";

// const MapMain = () => {
//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);

//   const [centerLong, setCenterLong] = useState(0)
//   const [centerLat, setCenterLat] = useState(0)

//   const { selectedLayers } = useMapViewStore(
//     useShallow((state) => ({ selectedLayers: state.selectedLayers }))
//   );

//   useEffect(() => {
//     mapRef.current = new maplibregl.Map({
//       container: mapContainerRef.current,
//       style: {
//         version: 8,
//         sources: {
//           "osm-tiles": {
//             type: "raster",
//             tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
//             tileSize: 256,
//             attribution: "©️ OpenStreetMap contributors",
//           },
//         },
//         layers: [
//           {
//             id: "osm-tiles-layer",
//             type: "raster",
//             source: "osm-tiles",
//           },
//         ],
//       },
//       center: [60, 70], // starting position
//       zoom: 8, // starting zoom
//     });

//     mapRef.current.addControl(new maplibregl.NavigationControl());

//     // `http://103.6.53.254:11790/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=${"_33B1_5RD_LN_SR_AIR_KECAMATANSAWIT_2021"}&bbox=${"110.65032861399999,-7.593513776000009,110.72121924800001,-7.553795591999972"}&width=768&height=395&srs=${"EPSG:4326"}&styles=&format=image%2Fpng1`,

//     console.log("ABC");
//     mapRef.current.on("load", () => {
//       // addLayerAndSources();
//       if (selectedLayers) {
//         selectedLayers.forEach((layer) => {

//           // This layer can have
//           const bboxString = layer.layerBbox.join(",");
//           const tempCenterLang = (layer.layerBbox[0] + layer.layerBbox[2]) / 2
//           const tempCenterLat = (layer.layerBbox[1] + layer.layerBbox[3]) / 2

//           setCenterLat(centerLat)
//           // const foobar = `http://dev3.webgis.co.id/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.pgTableName}&bbox=${bboxString}&width=1000&height=1000&srs=${layer.layerSrs}&styles=&format=image%2Fpng&transparent=true`;
//           // debugger;
//           mapRef.current.addSource(layer.layerUid, {
//             type: "raster",
//             tiles: [
//               `http://dev3.webgis.co.id/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.pgTableName}&bbox=${bboxString}&width=1000&height=1000&srs=${layer.layerSrs}&styles=&format=image%2Fpng&transparent=true`,
//             ],
//             maxZoom: 10,
//           });
//           // debugger;

//           mapRef.current.addLayer({
//             id: `${layer.layerUid}-id`,
//             type: "raster",
//             source: layer.layerUid,
//             layout: {
//               visibility: "visible",
//             },
//           });
//         });
//       }

//       // mapRef.current.addLayer()
//       // mapRef.current.on("move", () => checkLayerVisibility());
//     });

//     // layer
//     // const addLayerAndSources = () => {
//     //   if (mapRef.current.getLayer("testing") === undefined) {
//     //     mapRef.current.addSource("testSource", {
//     //       type: "raster",
//     //       tiles: [
//     //         "http://103.6.53.254:11790/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=geocms%3A_33b1_5rd_ln_sr_energi_kecamatansawit_2021_aspbq&bbox=110.65032196044922%2C-7.593528747558594%2C110.72122192382812%2C-7.5570068359375&width=768&height=395&srs=EPSG%3A4326&styles=&format=image%2Fpng",
//     //       ],
//     //       maxZoom: 40,
//     //     });

//     //     mapRef.current.addLayer({
//     //       id: "testing",
//     //       type: "raster",
//     //       source: "testSource",
//     //       paint: {},
//     //       layout: {
//     //         visibility: "none",
//     //       },
//     //     });
//     //   }
//     // });

//     return () => mapRef.current.remove(); // Cleanup on unmount
//   }, [selectedLayers]);

//   return <div ref={mapContainerRef} className="w-full h-full" />;
// };

// export default MapMain;

// import React, { useEffect, useRef, useState } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS
// import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
// import { useShallow } from "zustand/react/shallow";

// const MapMain = () => {
//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);

//   const { selectedLayers } = useMapViewStore(
//     useShallow((state) => ({ selectedLayers: state.selectedLayers }))
//   );

//   useEffect(() => {
//     if (!mapRef.current) {
//       mapRef.current = new maplibregl.Map({
//         container: mapContainerRef.current,
//         style: {
//           version: 8,
//           sources: {
//             "osm-tiles": {
//               type: "raster",
//               tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
//               tileSize: 256,
//               attribution: "©️ OpenStreetMap contributors",
//             },
//           },
//           layers: [
//             {
//               id: "osm-tiles-layer",
//               type: "raster",
//               source: "osm-tiles",
//             },
//           ],
//         },
//         center: [60, 70], // This will be updated below
//         zoom: 8, // This might be adjusted based on the BBoxes
//       });

//       mapRef.current.addControl(new maplibregl.NavigationControl());
//     }

//     const updateLayersAndView = () => {
//       if (selectedLayers && selectedLayers.length) {
//         const bounds = new maplibregl.LngLatBounds();

//         selectedLayers.forEach((layer) => {
//           const bboxString = layer.layerBbox.join(",");
//           const url = `http://dev3.webgis.co.id/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.pgTableName}&bbox=${bboxString}&width=1000&height=1000&srs=${layer.layerSrs}&styles=&format=image%2Fpng&transparent=true`;

//           if (!mapRef.current.getSource(layer.layerUid)) {
//             mapRef.current.addSource(layer.layerUid, {
//               type: "raster",
//               tiles: [url],
//               maxZoom: 22, // Adjusted for better detail
//             });

//             mapRef.current.addLayer({
//               id: `${layer.layerUid}-id`,
//               type: "raster",
//               source: layer.layerUid,
//               layout: {
//                 visibility: "visible",
//               },
//             });
//           }

//           // Extend the bounds to include this layer's BBox
//           bounds.extend([
//             [layer.layerBbox[0], layer.layerBbox[1]],
//             [layer.layerBbox[2], layer.layerBbox[3]],
//           ]);
//         });

//         // Fit the map view to the bounds that encompass all selected layers
//         mapRef.current.fitBounds(bounds, {
//           padding: 20, // Add some padding for better view
//         });
//       }
//     };

//     mapRef.current.on("load", updateLayersAndView);

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove(); // Cleanup on unmount
//       }
//     };
//   }, [selectedLayers]);

//   return <div ref={mapContainerRef} className="w-full h-full" />;
// };

// export default MapMain;

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // Import MapLibre GL CSS
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { useShallow } from "zustand/react/shallow";

const MapMain = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [centerLat] = useState(1);
  const [centerLong] = useState(0);

  const { selectedLayers } = useMapViewStore(
    useShallow((state) => ({ selectedLayers: state.selectedLayers }))
  );

  const updateLayerVisibility = () => {
    const mapBounds = mapRef.current.getBounds();

    selectedLayers.forEach((layer) => {
      const layerId = `${layer.layerUid}-id`;
      const layerBBox = new maplibregl.LngLatBounds(
        [layer.layerBbox[0], layer.layerBbox[1]],
        [layer.layerBbox[2], layer.layerBbox[3]]
      );

      // Check if layer's BBox intersects with the current map bounds
      const isVisible = mapBounds.intersects(layerBBox);
      mapRef.current.setLayoutProperty(
        layerId,
        "visibility",
        isVisible ? "visible" : "none"
      );
    });
  };

  useEffect(() => {
    if (!mapRef.current) {
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

      mapRef.current.addControl(new maplibregl.NavigationControl());
    }

    const updateLayersAndView = () => {
      if (selectedLayers && selectedLayers.length) {
        const bounds = new maplibregl.LngLatBounds();

        selectedLayers.forEach((layer) => {
          const bboxString = layer.layerBbox.join(",");
          const url = `http://dev3.webgis.co.id/geoserver/geocms/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layer.pgTableName}&bbox=${bboxString}&width=1000&height=1000&srs=${layer.layerSrs}&styles=&format=image%2Fpng&transparent=true`;

          if (!mapRef.current.getSource(layer.layerUid)) {
            mapRef.current.addSource(layer.layerUid, {
              type: "raster",
              tiles: [url],
              maxZoom: 22, // Adjusted for better detail
            });

            mapRef.current.addLayer({
              id: `${layer.layerUid}-id`,
              type: "raster",
              source: layer.layerUid,
              layout: {
                visibility: "visible",
              },
            });
          }

          // Extend the bounds to include this layer's BBox
          bounds.extend([
            [layer.layerBbox[0], layer.layerBbox[1]],
            [layer.layerBbox[2], layer.layerBbox[3]],
          ]);
        });

        // Fit the map view to the bounds that encompass all selected layers
        mapRef.current.fitBounds(bounds, {
          padding: 20, // Add some padding for better view
        });
      }
    };

    mapRef.current.on("load", updateLayersAndView);

    // return () => {
    //   if (mapRef.current && mapRef.current.remove()) {
    //     mapRef.current.remove(); // Cleanup on unmount
    //   }
    // };
  }, [selectedLayers]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapMain;
