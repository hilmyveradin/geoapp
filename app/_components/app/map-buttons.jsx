import { Button } from "@/components/ui/button";
import ComposeMapDialog from "./compose-map-dialog";
import { Filter } from "lucide-react";
import { Plus, Search } from "lucide-react";
import { ArrowDownWideNarrow } from "lucide-react";
import useSearchQueryStore from "@/helpers/hooks/store/use-search-query-store";

const MapsButtons = () => {
  const { searchedMapTitle, setSearchedMapTitle } = useSearchQueryStore();
  return (
    <div className="flex items-center justify-between w-full">
      {/* <Button variant="secondary" className="flex gap-2">
        <Filter className="w-5 h-5" fill="#006236" />
        Filter
      </Button> */}
      {/*TODO: Delete this later */}
      <div className="flex justify-center w-full">
        <div className="flex items-center gap-2 py-2 pl-2 pr-3 mr-3 bg-white rounded-lg w-full" >
          <Search className="w-4 h-4" />
          <input
            placeholder="Search for maps"
            className="w-full border-none outline-none"
            value={searchedMapTitle}
            onChange={(e) => setSearchedMapTitle(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-grow" />
      <div className="flex items-center justify-center gap-4">
        <ComposeMapDialog>
          <Button className="flex gap-2">
            <Plus className="w-5 h-5 stroke-[4px]" fill="white" />
            Add Map
          </Button>
        </ComposeMapDialog>
        {/* <Button variant="secondary" className="flex gap-2">
          <ArrowDownWideNarrow className="w-5 h-5" fill="#006236" />
          Sort By
        </Button> */}
      </div>
    </div>
  );
};

export default MapsButtons;
