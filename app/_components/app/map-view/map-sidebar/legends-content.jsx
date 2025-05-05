"use client";

import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";

const LegendsContent = () => {
  const { selectedLayers } = useMapViewStore();

  return (
    <div className="flex flex-col gap-3">
      {selectedLayers.map((data, index) => {
        return (
          <img
            key={`${data}-${index}`}
            src={data.legendUrl}
            className="w-10 h-10"
          />
        );
      })}
    </div>
  );
};

export default LegendsContent;
