import { useEffect, useRef } from "react";
import useMapViewStore from "./store/use-map-view-store";

const useMapStyleManager = () => {
  const { map, mapStyle } = useMapViewStore();

  // useEffect(() => {
  //   if (!map || !mapStyle) return;
  //   map.setStyle(mapStyle);
  //   // print("CALLED 2");
  //   console.log("CALLED 2");
  // }, [mapStyle, map]);
};

export default useMapStyleManager;
