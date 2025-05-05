import { useEffect } from "react";
import useMapViewStore from "./store/useMapViewStore";

const useHighlightManager = () => {
  const { highlightedLayer, map } = useMapViewStore();
  const highlightLayerId = "highlight-layer"; // Consistent ID for the highlight layer

  useEffect(() => {
    // Function to update or replace the highlight layer
    const updateHighlightLayer = (geojsonData) => {
      // Ensure the map is loaded and the geojson data is available
      if (map && geojsonData) {
        let layerType;
        const featureType = geojsonData.features[0].geometry.type;
        let paintProperties = {};

        // Determine the appropriate layer type and paint properties based on the GeoJSON feature type
        switch (featureType) {
          case "Point":
          case "MultiPoint":
            layerType = "circle";
            paintProperties = {
              "circle-color": "#EBA0DB",
              "circle-radius": 10,
              "circle-stroke-color": "#EBA0DB",
              "circle-stroke-width": 2,
            };
            break;
          case "LineString":
          case "MultiLineString":
            layerType = "line";
            paintProperties = {
              "line-color": "#EBA0DB",
              "line-width": 5,
            };
            break;
          case "Polygon":
          case "MultiPolygon":
            layerType = "fill";
            paintProperties = {
              "fill-color": "#EBA0DB",
              "fill-outline-color": "#EBA0DB",
            };
            break;
          default:
            console.error("Unsupported geometry type:", featureType);
            return; // Exit if geometry type is not supported
        }

        // Always remove existing layer and source if they exist
        if (map.getLayer(highlightLayerId)) {
          map.removeLayer(highlightLayerId);
          map.removeSource(highlightLayerId);
        }

        // Create a new source and layer with the updated data
        map.addSource(highlightLayerId, {
          type: "geojson",
          data: geojsonData,
        });

        map.addLayer({
          id: highlightLayerId,
          type: layerType,
          source: highlightLayerId,
          paint: paintProperties,
        });
      }
    };

    // Function to remove the highlight layer
    const removeHighlightLayer = () => {
      if (map && map.getLayer(highlightLayerId)) {
        map.removeLayer(highlightLayerId);
        map.removeSource(highlightLayerId);
      }
    };

    // Check if highlightedLayers is provided and handle accordingly
    if (highlightedLayer) {
      updateHighlightLayer(highlightedLayer); // Pass the actual GeoJSON data here
    } else {
      removeHighlightLayer();
    }
  }, [highlightedLayer, map]); // Dependencies include highlightedLayers and map
};

export default useHighlightManager;
