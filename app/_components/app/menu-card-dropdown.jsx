import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PencilIcon } from "lucide-react";
import ChangePropDialog from "./shared/change-prop-dialog";
import { useState } from "react";

const MenuCardDropdown = ({ children, cardData }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleDropdownClick = (e) => {
    // Stop the click event from propagating up to parent elements
    e.stopPropagation();
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={handleDropdownClick}>
        <DropdownMenuItem asChild onClick={handleDropdownClick}>
          <button className="flex w-full">
            <img
              src="/app/item-details-icon.svg"
              alt="item details"
              className="w-5 h-5 mr-3"
            />
            <p>View item details</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={handleDropdownClick}>
          <ChangePropDialog
            changePropType={cardData.cardType}
            objectUid={cardData.cardUid}
            initialTitle={cardData.cardTitle}
            initialDescription={cardData.cardDescription}
            initialTags={cardData.cardTags}
            onCompleteHandler={handleCloseDropdown}
          >
            <button className="flex justify-center w-full gap-3 p-1 text-md hover:bg-slate-100 relative cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <PencilIcon className="w-4 h-4 stroke-2" />
              <p>Change properties</p>
            </button>
          </ChangePropDialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={handleDropdownClick}>
          <button className="flex w-full">
            <img
              src="/app/share-people-icon.svg"
              alt="share icon"
              className="w-5 h-5 mr-3"
            />
            <p>Share</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={handleDropdownClick}>
          <button className="flex w-full">
            <img
              src="/app/delete-icon.svg"
              alt="delete icon"
              className="w-5 h-5 mr-3"
            />
            <p>Delete</p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuCardDropdown;
