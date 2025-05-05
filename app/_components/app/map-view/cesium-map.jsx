import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const CesiumMap = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current) {
      // Initialize Cesium viewer
      const viewer = new Cesium.Viewer("cesiumContainer");
      viewerRef.current = viewer;

      // Load tileset
      loadTileset(viewer);

      // Set up event handler
      setupEventHandler(viewer);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  const loadTileset = async (viewer) => {
    try {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(
        "/jakarta/building/Building/tileset.json",
        {
          debugShowBoundingVolume: false,
        }
      );
      viewer.scene.primitives.add(tileset);

      // Wait for the tileset to load
      await tileset.readyPromise;

      tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
          evaluateColor: function (feature, result) {
            var height = feature.getProperty("citygml_measured_height");

            // Normalize height to a value between 0 and 1
            // Adjust maxHeight based on your data
            var maxHeight = 100; // Example max height in meters
            var normalizedHeight = Math.min(height / maxHeight, 1);

            // Create a color gradient from white to light blue based on height
            return Cesium.Color.lerp(
              Cesium.Color.WHITE,
              Cesium.Color.AQUA,
              normalizedHeight,
              result
            );
          },
        },
        outlinecol,
      });

      // Get the bounding sphere
      const boundingSphere = tileset.boundingSphere;

      // Log the center of the bounding sphere
      const cartographic = Cesium.Cartographic.fromCartesian(
        boundingSphere.center
      );
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      console.log(`Tileset center: ${lat}, ${lon}, ${height}`);

      // Zoom to the tileset
      viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(0, -Math.PI / 4, boundingSphere.radius * 2)
      );
    } catch (error) {
      console.error("Error loading tileset:", error);
    }
  };

  const setupEventHandler = (viewer) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement) => {
      const picked = viewer.scene.pick(movement.endPosition);

      if (
        Cesium.defined(picked) &&
        picked.primitive instanceof Cesium.Cesium3DTileset
      ) {
        const properties = picked.getProperty("properties");
        if (properties) {
          console.log("Properties:", properties);
          // You can handle the properties here, e.g., update state to show in UI
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };

  return (
    <div id="cesiumContainer" style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default CesiumMap;
