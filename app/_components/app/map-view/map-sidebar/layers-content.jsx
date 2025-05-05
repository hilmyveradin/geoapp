import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import useMapViewStore from "@/helpers/hooks/useMapViewStore";
import { MoreHorizontal } from "lucide-react";

const LayersContent = () => {
  const { layersData } = useMapViewStore();

  return (
    <TabsContent value="layers" className="pt-4">
      {layersData.map((item, index) => {
        return <LayersCard key={`${item}-${index}`} data={item} />;
      })}
    </TabsContent>
  );
};

export default LayersContent;

const LayersCard = ({ data }) => {
  const buttonIcons = [
    "/app/map-view/icon-1.svg",
    "/app/map-view/icon-2.svg",
    "/app/map-view/icon-3.svg",
    "/app/map-view/icon-4.svg",
  ];

  return (
    <div className="flex items-start w-full h-20 gap-3 mb-3 ml-3">
      <Checkbox className="w-6 h-6 mt-[2px]" />
      <div className="flex flex-col gap-2">
        <p className="text-lg">{data.layerTitle}</p>
        <div className="flex items-center gap-4">
          {buttonIcons.map((item, index) => {
            return (
              <img
                key={`${item}-${index}`}
                src={item}
                className="flex items-center w-5 h-5 cursor-pointer"
              />
            );
          })}

          <Separator orientation="vertical" className="w-[2px] h-6" />
          <MoreHorizontal className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
