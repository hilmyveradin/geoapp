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
import DestructiveDialog from "../shared/DestructiveDialog";
import useRefetchStore from "@/helpers/hooks/store/useRefetchStore";
import { Trash2 } from "lucide-react";
import { handleErrorMessage } from "@/helpers/string-helpers";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
const MenuCardDropdown = ({ children, cardData }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { toggleRefetchLayers, toggleRefetchMaps } = useRefetchStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleDropdownClick = (e) => {
    // Stop the click event from propagating up to parent elements
    e.stopPropagation();
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };

  const deleteAction = async () => {
    if (cardData.cardType === "map") {
      try {
        const response = await fetch(
          `/api/maps/delete-map?mapUid=${cardData.cardUid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const error = new Error(response.statusText || "Unknown error");
          error.status = response.status;
          throw error;
        }

        const data = await response.json();
        if (data.status.includes("failed")) {
          const error = new Error(response.statusText || "Unknown error");
          error.status = response.status;
          throw error;
        }

        toast({ title: "Success deleting maps", variant: "success" });
        toggleRefetchMaps();
        handleCloseDropdown();
      } catch (error) {
        const { title, description } = handleErrorMessage(error.status);
        toast({
          title: title,
          description: description, // Provides more specific error detail
          variant: "destructive",
        });
      }
    } else {
      try {
        // TODO: Fix this layer code. The payload shouldn't have any layer_uid from BE
        const response = await fetch(
          `/api/layers/delete-layer?layerUid=${cardData.cardUid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const error = new Error(response.statusText || "Unknown error");
          error.status = response.status;
          throw error;
        }

        const data = await response.json();
        if (data.status.includes("failed")) {
          const error = new Error(response.statusText || "Unknown error");
          error.status = response.status;
          throw error;
        }

        toast({ title: "Success deleting layer", variant: "success" });
        toggleRefetchLayers();
      } catch (error) {
        console.error("Error during fetch:", error.message);
        const { title, description } = handleErrorMessage(error.status);
        toast({
          title: title,
          description: description, // Provides more specific error detail
          variant: "destructive",
        });
      }
    }
  };

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={handleDropdownClick}>
        <DropdownMenuItem
          asChild
          onClick={(e) => {
            e.stopPropagation();
            router.push(
              `/app/overview/${cardData.cardType}/${cardData.cardUid}`
            );
          }}
        >
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
        {/* <DropdownMenuItem asChild onClick={handleDropdownClick}>
          <button className="flex w-full">
            <img
              src="/app/share-people-icon.svg"
              alt="share icon"
              className="w-5 h-5 mr-3"
            />
            <p>Share</p>
          </button>
        </DropdownMenuItem> */}
        <DropdownMenuItem asChild onClick={handleDropdownClick}>
          <DestructiveDialog
            title={`Are you sure you want to delete this ${cardData.cardType}`}
            description="This action cannot be undone"
            actionText="Yes, I'm sure"
            action={() => deleteAction()}
          >
            <button className="flex justify-left w-full p-1 text-md hover:bg-slate-100 relative cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <Trash2 className="w-4 h-4 mr-3" />
              <p>{`Delete ${cardData.cardType}`}</p>
            </button>
          </DestructiveDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuCardDropdown;
