import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import UserAvatar from "./shared/user-avatar";
import { Button } from "@/components/ui/button";
import MenuCardDropdown from "./menu-card-dropdown";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRouter } from "next/navigation";
import useCardStore from "@/helpers/hooks/store/use-card-store";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

const MenuCard = ({ cardData }) => {
  const { isCtrlPressed, toggleCardSelection, selectedCards } = useCardStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCardClick = (e) => {
    if (isCtrlPressed) {
      toggleCardSelection(cardData.cardUid);
      return;
    }
    router.push(`/app/overview/${cardData.cardType}/${cardData.cardUid}`);
  };

  const handleViewClick = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      router.push(`/app/map-view/${cardData.cardType}/${cardData.cardUid}`);
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "Failed to open the map view. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSelected = selectedCards.some((id) => id === cardData.cardUid);

  return (
    <Card
      className={cn(
        "px-2 py-3 shadow-lg cursor-pointer hover:bg-zinc-50 bg-zinc-100",
        { "outline-nileBlue-700 outline": isSelected }
      )}
      onClick={handleCardClick}
    >
      <CardContent className="relative flex items-center justify-center p-0">
        <AspectRatio
          ratio={450 / 200}
          className="flex items-center justify-center"
        >
          <img
            src={cardData.thumbnailUrl}
            alt={`Thumbnail for ${cardData.cardTitle}`}
            layout="fill"
            objectFit="cover"
          />
        </AspectRatio>
        <MenuCardDropdown cardData={cardData}>
          <MoreVertical className="absolute w-5 h-5 cursor-pointer right-0 top-0.5" />
        </MenuCardDropdown>
      </CardContent>
      <CardHeader className="flex flex-col p-0 mt-2">
        <h3 className="font-semibold truncate">{cardData.cardTitle}</h3>
        <CardDescription className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <UserAvatar user={cardData.creator} />
            <p className="truncate">{cardData.creator.fullName}</p>
          </div>
          <Button onClick={handleViewClick} disabled={isLoading}>
            {isLoading ? "Loading..." : "View"}
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MenuCard;
