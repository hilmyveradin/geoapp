import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Plus } from "lucide-react";
import { ArrowDownWideNarrow } from "lucide-react";
import CreateGroupDialog from "./groups/create-group-dialog";

const GroupButtons = () => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* <Button variant="secondary" className="flex gap-2">
        <Filter className="w-5 h-5" fill="#006236" />
        Filter
      </Button> */}
      {/*TODO: Delete this later */}
      <div className="flex-grow" />
      <div className="flex items-center justify-center gap-4">
        <CreateGroupDialog>
          <Button className="flex gap-2">
            <Plus className="w-5 h-5 stroke-[4px]" fill="white" />
            Add Group
          </Button>
        </CreateGroupDialog>
        {/* <Button variant="secondary" className="flex gap-2">
          <ArrowDownWideNarrow className="w-5 h-5" fill="#006236" />
          Sort By
        </Button> */}
      </div>
    </div>
  );
};

export default GroupButtons;
