import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

const IFCCesiumMap = () => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current) {
      // Initialize Cesium viewer
      const viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false,
      });
      viewerRef.current = viewer;

      // Load tileset
      // loadTileset(viewer);
      setupIFCLoader(viewer);

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

  const setupIFCLoader = async (viewer) => {
    const components = new OBC.Components();
    const fragments = components.get(OBC.FragmentsManager);
    const fragmentIfcLoader = components.get(OBC.IfcLoader);

    await fragmentIfcLoader.setup();

    // Exclude certain IFC categories if needed
    const excludedCats = [
      WEBIFC.IFCTENDONANCHOR,
      WEBIFC.IFCREINFORCINGBAR,
      WEBIFC.IFCREINFORCINGELEMENT,
    ];

    for (const cat of excludedCats) {
      fragmentIfcLoader.settings.excludedCategories.add(cat);
    }

    // Load IFC file
    const url = "/UE22-Base_MN_1111-LR-Existant.ifc";
    try {
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      const buffer = new Uint8Array(data);
      const model = await fragmentIfcLoader.load(buffer);
      model.name = "example";

      // Wait for fragments to be loaded
      await new Promise((resolve) => {
        fragments.onFragmentsLoaded.add((loadedModel) => {
          if (loadedModel.name === model.name) {
            resolve();
          }
        });
      });

      // Now we can access the fragment group
      const fragmentGroup = fragments.groups.get(model.name);
      if (fragmentGroup) {
        const geometryData = fragments.export(fragmentGroup);

        // Create a Cesium entity from the IFC geometry
        const entity = viewer.entities.add({
          name: "IFC Model",
          position: Cesium.Cartesian3.fromDegrees(0, 0, 0), // Adjust as needed
          model: {
            uri: URL.createObjectURL(
              new Blob([geometryData], { type: "application/octet-stream" })
            ),
            scale: 1.0,
          },
        });

        console.log(entity);
        viewer.zoomTo(entity);

        // Optionally, you can access properties
        const properties = fragmentGroup.getLocalProperties();
        console.log("IFC Properties:", properties);
      } else {
        debugger;
        console.error("Fragment group not found for model:", model.name);
      }
    } catch (error) {
      debugger;
      console.error("Error loading IFC file:", error);
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
    <div
      id="cesiumContainer"
      ref={containerRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default IFCCesiumMap;

/*
const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

await fragmentIfcLoader.setup();

// If you want to the path to unpkg manually, then you can skip the line
// above and set them manually as below:
// fragmentIfcLoader.settings.wasm = {
//   path: "https://unpkg.com/web-ifc@0.0.57/",
//   absolute: true,
// };

const excludedCats = [
  WEBIFC.IFCTENDONANCHOR,
  WEBIFC.IFCREINFORCINGBAR,
  WEBIFC.IFCREINFORCINGELEMENT,
];

for (const cat of excludedCats) {
  fragmentIfcLoader.settings.excludedCategories.add(cat);
}
  async function loadIfc() {
  const file = await fetch(
    "https://thatopen.github.io/engine_components/resources/small.ifc",
  );
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await fragmentIfcLoader.load(buffer);
  model.name = "example";
  world.scene.three.add(model);
}

fragments.onFragmentsLoaded.add((model) => {
  console.log(model);
});

function download(file: File) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function exportFragments() {
  if (!fragments.groups.size) {
    return;
  }
  const group = Array.from(fragments.groups.values())[0];
  const data = fragments.export(group);
  download(new File([new Blob([data])], "small.frag"));

  const properties = group.getLocalProperties();
  if (properties) {
    download(new File([JSON.stringify(properties)], "small.json"));
  }
}
*/
