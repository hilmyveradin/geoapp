import React, { useEffect, useState } from "react";
import { IfcViewerAPI } from "web-ifc-viewer";
import {
  IFCWALL,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCWINDOW,
  IFCMEMBER,
  IFCPLATE,
  IFCCURTAINWALL,
  IFCDOOR,
  IFCRAMP,
  IFCSTAIR,
  IFCBUILDINGELEMENTPROXY,
  IFCSITE,
  IFCCOLUMN,
  IFCFLOWTERMINAL,
  IFCRAILING,
  IFCFURNISHINGELEMENT,
  IFCROOF,
  IFCTRANSPORTELEMENT,
  IFCBEAM,
  IFCCOVERING,
} from "web-ifc";

import {
  Cartesian3,
  Color,
  defaultValue,
  defined,
  DeveloperError,
  Ellipsoid,
  Event,
  HeadingPitchRoll,
  HeightReference,
  Math,
  PinBuilder,
  DataSource,
  EntityCollection,
  Transforms,
} from "cesium";

const IFCDataSource = ({ data, options }) => {
  const [entityCollection, setEntityCollection] = useState(
    new EntityCollection()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIFCData = async () => {
      setIsLoading(true);
      try {
        const result = await processIFCData(data, options);
        updateEntityCollection(result);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadIFCData();
  }, [data, options]);

  const onProgress = (progress, total, process) => {
    console.debug(
      `IFCDataSource › processIFCData() › onProgress:`,
      progress,
      total,
      process
    );
  };

  const processIFCData = async (data, options) => {
    const ifcBaseURL = options.ifcBaseURL;
    const viewerIFC = new IfcViewerAPI({
      container: document.createElement("div"),
    });
    viewerIFC.IFC.setWasmPath(ifcBaseURL);

    const dataAsBlobURL = URL.createObjectURL(data);
    const result = await viewerIFC.GLTF.exportIfcFileAsGltf({
      ifcFileUrl: dataAsBlobURL,
      splitByFloors: true,
      categories: {
        IFCWALL: [IFCWALL],
        IFCWALLSTANDARDCASE: [IFCWALLSTANDARDCASE],
        IFCSLAB: [IFCSLAB],
        IFCWINDOW: [IFCWINDOW],
        IFCMEMBER: [IFCMEMBER],
        IFCPLATE: [IFCPLATE],
        IFCCURTAINWALL: [IFCCURTAINWALL],
        IFCDOOR: [IFCDOOR],
        IFCRAMP: [IFCRAMP],
        IFCSTAIR: [IFCSTAIR],
        IFCBUILDINGELEMENTPROXY: [IFCBUILDINGELEMENTPROXY],
        IFCSITE: [IFCSITE],
        IFCCOLUMN: [IFCCOLUMN],
        IFCFLOWTERMINAL: [IFCFLOWTERMINAL],
        IFCRAILING: [IFCRAILING],
        IFCCOVERING: [IFCCOVERING],
        IFCFURNISHINGELEMENT: [IFCFURNISHINGELEMENT],
        IFCROOF: [IFCROOF],
        IFCTRANSPORTELEMENT: [IFCTRANSPORTELEMENT],
        IFCBEAM: [IFCBEAM],
      },
      getProperties: false,
      getModels: true,
      onProgress: onProgress,
    });

    URL.revokeObjectURL(dataAsBlobURL);
    await viewerIFC.dispose();

    return result;
  };

  const updateEntityCollection = (result) => {
    const [lat, long, alt] = options.modelOrigin;
    const [heading, pitch, roll] = options.modelOrientation;
    const clampToGround = options.clampToGround;

    const modelOrigin = Cartesian3.fromDegrees(lat, long, alt);
    const [headingRad, pitchRad, rollRad] = [
      Math.toRadians(heading),
      Math.toRadians(pitch),
      Math.toRadians(roll),
    ];
    const HPR = new HeadingPitchRoll(headingRad, pitchRad, rollRad);
    const modelOrientation = Transforms.headingPitchRollQuaternion(
      modelOrigin,
      HPR
    );

    const newEntityCollection = new EntityCollection();

    for (const categoryName in result.gltf) {
      const category = result.gltf[categoryName];
      for (const levelName in category) {
        const file = category[levelName].file;
        if (file) {
          const fileObjURL = URL.createObjectURL(file);
          const modelName =
            categoryName !== "allCategories"
              ? `Category: ${categoryName} / Level: ${levelName}`
              : `Level: ${levelName}`;
          newEntityCollection.add({
            position: modelOrigin,
            orientation: modelOrientation,
            name: modelName,
            levelName: levelName,
            categoryName: categoryName,
            model: {
              uri: fileObjURL,
              silhouetteColor: Color.WHITE.withAlpha(0.5),
              silhouetteSize: 2.0,
              shadows: true,
              heightReference: clampToGround
                ? HeightReference.CLAMP_TO_GROUND
                : HeightReference.RELATIVE_TO_GROUND,
            },
          });
        }
      }
    }

    setEntityCollection(newEntityCollection);
  };

  return (
    <div>
      {isLoading && <p>Loading IFC data...</p>}
      {error && <p>Error: {error.message}</p>}
      {/* Render your Cesium viewer or other components here */}
    </div>
  );
};

export default IFCDataSource;
