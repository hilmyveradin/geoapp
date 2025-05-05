import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Plus } from "lucide-react";
import { ArrowDownWideNarrow } from "lucide-react";
import CreateGroupDialog from "./groups/create-group-dialog";
import { Search } from "lucide-react";
import useSearchQueryStore from "@/helpers/hooks/store/use-search-query-store";
import useUserStore from "@/helpers/hooks/store/use-user-store";

const GroupButtons = () => {
  const { isAdmin } = useUserStore();
  const { searchedGroupTitle, setSearchedGroupTitle } = useSearchQueryStore(); // Added state for search term
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex justify-center w-full">
        <div className="flex items-center gap-2 py-2 pl-2 pr-3 mr-3 bg-white rounded-lg w-full">
          <Search className="w-4 h-4" />
          <input
            placeholder="Search for groups"
            className="w-full border-none outline-none"
            value={searchedGroupTitle}
            onChange={(e) => setSearchedGroupTitle(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-grow" />
      {isAdmin && (
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
      )}
    </div>
  );
};

export default GroupButtons;
