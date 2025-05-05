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
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MenuCard = (props) => {
  const { key, cardData } = props;
  return (
    <Link href={`/app/overview/${cardData.cardType}/${cardData.cardUid}`}>
      <Card
        key={key}
        className="px-2 py-3 shadow-lg cursor-pointer hover:bg-zinc-50 bg-zinc-100"
      >
        <CardContent className="relative flex items-center justify-center p-0">
          <AspectRatio
            ratio={450 / 200}
            className="flex items-center justify-center"
          >
            <img src={cardData.thumbnailUrl} alt="Thumbnail" />
          </AspectRatio>
          <MenuCardDropdown>
            <MoreVertical className="absolute w-5 h-5 cursor-pointer right-0 top-0.5" />
          </MenuCardDropdown>
        </CardContent>
        <CardHeader className="flex p-0 mt-2">
          <h3 className={cn("font-semibold truncate")}>{cardData.cardTitle}</h3>
          <CardDescription className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <UserAvatar user={cardData.creator} />
              <p> {cardData.creator.fullName} </p>
            </div>
            <Link
              href={`/app/map-view/${cardData.cardType}/${cardData.cardUid}`}
            >
              <Button className="bg-gableGreen-500 hover:bg-gableGreen-400">
                View
              </Button>
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default MenuCard;
