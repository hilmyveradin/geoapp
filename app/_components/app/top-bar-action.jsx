import { Button } from "@/components/ui/button";
import ComposeMapDialog from "./compose-map-dialog";

const TopBarAction = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <Button>Filter</Button>
      <div className="flex items-center justify-center gap-4">
        <ComposeMapDialog>
          <Button>Add Items</Button>
        </ComposeMapDialog>
        <Button>Sort By</Button>
      </div>
    </div>
  );
};

export default TopBarAction;
