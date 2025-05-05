import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MenuCardDropdown = ({ children }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
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
        <DropdownMenuItem asChild>
          <button className="flex w-full">
            <img
              src="/app/rename-icon.svg"
              alt="rename icon"
              className="w-5 h-5 mr-3"
            />
            <p>Rename</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="flex w-full">
            <img
              src="/app/share-people-icon.svg"
              alt="share icon"
              className="w-5 h-5 mr-3"
            />
            <p>Share</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
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
