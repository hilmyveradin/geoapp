"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import UserAvatar from "./shared/user-avatar";
import { Button } from "@/components/ui/button";
import MenuCardDropdown from "./menu-card-dropdown";
import { useRouter } from "next/navigation";

const MenuCard = (props) => {
  const { key, source, title, user, moreAction, viewAction, layerUid } = props;
  const router = useRouter();
  return (
    <Card
      key={key}
      className="px-2 py-3 shadow-lg hover:bg-lime-500 bg-lime-300"
      onClick={() => {
        router.push(`/app/layer-overview/${layerUid}`);
      }}
    >
      <CardContent className="relative flex items-center justify-center p-0">
        <img src={source} alt="Thumbnail" className="w-full" />
        <MenuCardDropdown>
          <MoreVertical className="absolute w-5 h-5 cursor-pointer right-0 top-0.5" />
        </MenuCardDropdown>
      </CardContent>
      <CardHeader className="flex p-0 mt-2">
        <h3 className={cn("font-semibold truncate")}>{title}</h3>
        <CardDescription className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <UserAvatar user={user} />
            <p> {user.fullName} </p>
          </div>
          <Button
            className="bg-green-700 hover:bg-green-600"
            onClick={viewAction}
          >
            View
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MenuCard;
