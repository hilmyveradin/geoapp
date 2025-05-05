"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=m1WUaSbdmuu7fm4re8lf",
        center: [106.86522, -10.40108],
        zoom: 4,
      });

      new maplibregl.Marker().setLngLat([1006, -5]).addTo(map);

      map.on("load", function () {
        const popup = new maplibregl.Popup({ closeOnClick: false });
        popup.setLngLat([106.8272291, -6.175392]);
        // popup.setHTML("<h1>Ini Monas!</h1>");
        // popup.addTo(map);

        map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          "bottom-right"
        );

        map.addControl(new maplibregl.NavigationControl(), "top-right");
      });
      map.on("load", () => {
        const layers = map.getStyle().layers;
        // Find the index of the first symbol layer in the map style
        let firstSymbolId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === "symbol") {
            firstSymbolId = layers[i].id;
            break;
          }
        }
        map.addSource("wms-layer", {
          type: "raster",
          tiles: [
            `http://dev3.webgis.co.id/geoserver/wms?VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=magang:BANGUNAN_AR_25K&STYLES=&SRS=EPSG:3857&CRS=EPSG:3857&TILED=true&WIDTH=512&HEIGHT=512&BBOX={bbox-epsg-3857}`,
          ],

          tileSize: 256,
        });
        map.addLayer(
          {
            id: "wms-layer",
            type: "raster",
            source: "wms-layer",
            // This is the important part of this example: the addLayer
            // method takes 2 arguments: the layer as an object, and a string
            // representing another layer's name. if the other layer
            // exists in the stylesheet already, the new layer will be positioned
            // right before that layer in the stack, making it possible to put
            // 'overlays' anywhere in the layer stack.
            // Insert the layer beneath the first symbol layer.
          },
          firstSymbolId
        );
      });

      return () => map.remove();
    }
  }, []);

  return <div ref={mapContainerRef} className="w-1/2 h-1/2" />;
};

export default MapComponent;
