import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowDownWideNarrow } from "lucide-react";
import { Search } from "lucide-react";
import { X } from "lucide-react";

const AddLayerCard = () => {
  return <div className="rounded-lg "></div>;
};
const AddLayerContent = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <p> Browser Layers</p>
        <X className="w-6 h-6" />
      </div>
      <div className="flex gap-2">
        <Search className="w-6 h-6" />
        <Input placeholder="Search for layers" />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <p>Items: </p>
          <p> 4 </p>
        </div>
        <ArrowDownWideNarrow className="w-5 h-5" />
      </div>
    </div>
  );
};

export default AddLayerContent;
