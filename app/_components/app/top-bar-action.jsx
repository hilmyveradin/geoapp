import { Button } from "@/components/ui/button";
import ComposeMapDialog from "./compose-map-dialog";
import { Filter } from "lucide-react";
import { Plus } from "lucide-react";
import { ArrowDownWideNarrow } from "lucide-react";

const TopBarAction = () => {
  return (
    <div className="flex items-center justify-between w-full px-4 mt-2">
      <Button variant="secondary" className="flex gap-2">
        <Filter className="w-5 h-5" fill="#006236" />
        Filter
      </Button>
      <div className="flex items-center justify-center gap-4">
        <ComposeMapDialog>
          <Button className="flex gap-2">
            <Plus className="w-5 h-5 stroke-[4px]" fill="white" />
            Add Map
          </Button>
        </ComposeMapDialog>
        <Button variant="secondary" className="flex gap-2">
          <ArrowDownWideNarrow className="w-5 h-5" fill="#006236" />
          Sort By
        </Button>
      </div>
    </div>
  );
};

export default TopBarAction;
