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
  Credit,
  defaultValue,
  defined,
  DeveloperError,
  Ellipsoid,
  Event,
  HeadingPitchRoll,
  HeightReference,
  Math, // NOTE: overrides standard Math lib
  PinBuilder,
  DataSource,
  EntityCluster,
  EntityCollection,
  Transforms,
} from "cesium";

function onProgress(progress, total, process) {
  // eslint-disable-next-line no-console
  console.debug(
    `IFCDataSource › processIFCData() › onProgress:`,
    progress,
    total,
    process
  );
}

async function processIFCData(dataSource, data, options) {
  const ifcBaseURL = options.ifcBaseURL;

  const viewerIFC = new IfcViewerAPI({ container: dataSource.canvas });
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
    getProperties: false, // NOTE: traitement des propriétés désactivé, parce qu'on ne sait pas
    getModels: true, // bien faire le lien entre le modèle GLTF et les propriétés IFC
    onProgress: onProgress,
    // coordinationMatrix: Matrix4
  });

  URL.revokeObjectURL(dataAsBlobURL);
  await viewerIFC.dispose();

  // TODO: normaliser ces valeurs et définir valeurs par défaut
  const [lat, long, alt] = options.modelOrigin; // [ 6.137499506, 46.192506022, 425.999 ]
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

  // const fileObjURLs = [];
  for (const categoryName in result.gltf) {
    // Catégories de l'IFC (`allCategories`)
    const category = result.gltf[categoryName];
    for (const levelName in category) {
      // Niveaux de l'IFC
      // console.log(`IFCDataSource › processIFCData() › Processing category ${categoryName}, level ${levelName}…`); // DEBUG
      const file = category[levelName].file;
      if (file) {
        // Ajout de chaque fichier glTF à la scène
        const fileObjURL = URL.createObjectURL(file);
        // fileObjURLs.push(fileObjURL);
        const modelName =
          categoryName !== "allCategories"
            ? `Category: ${categoryName} / Level: ${levelName}`
            : `Level: ${levelName}`;
        dataSource.entities.add({
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

  return result;
}

async function loadIFC(dataSource, entityCollection, data, options) {
  // console.log(`IFCDataSource › loadIFC(dataSource, entityCollection, data, options):`,
  //   dataSource, entityCollection, dumpIfcData(data, 25), options);

  // TODO: read this from IFC data
  let name = options.sourceUri;
  // console.log(`IFCDataSource › loadIFC() › name:`, name);
  // Only set the name from the root document
  if (!defined(dataSource._name)) {
    dataSource._name = name;
  }

  entityCollection.removeAll();
  entityCollection.suspendEvents();

  const result = await processIFCData(dataSource, data, options);
  // console.log(`IFCDataSource › loadIFC() › result:`, result);

  entityCollection.resumeEvents();

  return result;
}

async function load(dataSource, entityCollection, data, options) {
  // console.log(`IFCDataSource › load(dataSource, entityCollection, data, options)`,
  //   dataSource, entityCollection, data, options) // DEBUG

  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  try {
    if (data instanceof Blob) {
      const result = await loadIFC(dataSource, entityCollection, data, options);
      return result;
    } else {
      throw TypeError(
        `'data' is expected to be instance of a Blob; got ${typeof data}`
      );
    }
  } catch (error) {
    dataSource._error.raiseEvent(dataSource, error);
    console.error(error);
    return Promise.reject(error);
  }
}

function IFCDataSource(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  this._changed = new Event();
  this._error = new Event();
  this._loading = new Event();
  this._refresh = new Event();

  this._clock = undefined;
  this._entityCollection = new EntityCollection(this);
  this._name = undefined;
  this._isLoading = false;
  this._pinBuilder = new PinBuilder();
  this._entityCluster = new EntityCluster();

  this.canvas = options.canvas;

  this._ellipsoid = defaultValue(options.ellipsoid, Ellipsoid.WGS84);

  // User specified credit
  let credit = options.credit;
  if (typeof credit === "string") {
    credit = new Credit(credit);
  }
  this._credit = credit;

  this._screenOverlays = [];
}

IFCDataSource.load = function (data, options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);
  const dataSource = new IFCDataSource(options);
  return dataSource.load(data, options);
};

Object.defineProperties(IFCDataSource.prototype, {
  name: {
    get: function () {
      return this._name;
    },
    set: function (value) {
      if (this._name !== value) {
        this._name = value;
        this._changed.raiseEvent(this);
      }
    },
  },

  clock: {
    get: function () {
      return this._clock;
    },
  },

  entities: {
    get: function () {
      return this._entityCollection;
    },
  },

  isLoading: {
    get: function () {
      return this._isLoading;
    },
  },

  changedEvent: {
    get: function () {
      return this._changed;
    },
  },

  errorEvent: {
    get: function () {
      return this._error;
    },
  },

  loadingEvent: {
    get: function () {
      return this._loading;
    },
  },

  refreshEvent: {
    get: function () {
      return this._refresh;
    },
  },

  show: {
    get: function () {
      return this._entityCollection.show;
    },
    set: function (value) {
      this._entityCollection.show = value;
    },
  },

  clustering: {
    get: function () {
      return this._entityCluster;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      if (!defined(value)) {
        throw new DeveloperError("value must be defined.");
      }
      //>>includeEnd('debug');
      this._entityCluster = value;
    },
  },

  credit: {
    get: function () {
      return this._credit;
    },
  },
});

IFCDataSource.prototype.load = function (data, options) {
  // console.log( `IFCDataSource#.load(data, options):`, data, options)

  //>>includeStart('debug', pragmas.debug);
  if (!defined(data)) {
    throw new DeveloperError("data is required.");
  }
  //>>includeEnd('debug');

  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  this._name = undefined;
  this._clampToGround = defaultValue(options.clampToGround, false);

  DataSource.setLoading(this, true);

  const that = this;
  return load(this, this._entityCollection, data, options)
    .then(function () {
      DataSource.setLoading(that, false);
      return that;
    })
    .catch(function (error) {
      DataSource.setLoading(that, false);
      that._error.raiseEvent(that, error);
      console.error(error);
      return Promise.reject(error);
    });
};

/**
 * Cleans up any non-entity elements created by the data source.
 * Currently this only affects ScreenOverlay elements.
 */
IFCDataSource.prototype.destroy = function () {
  while (this._screenOverlays.length > 0) {
    const elem = this._screenOverlays.pop();
    elem.remove();
  }
};

IFCDataSource.prototype.update = function (time) {
  return true;
};

export default IFCDataSource;
