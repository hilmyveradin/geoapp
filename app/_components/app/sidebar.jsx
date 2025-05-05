"use client";

import { getUserNameInitial } from "@/app/_helpers/stringHelpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PinBottomIcon } from "@radix-ui/react-icons";
import { HomeIcon } from "lucide-react";
import { MapIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const AppSidebar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [isAsideHovered, setIsAsideHovered] = useState(false);

  const sidebarItems = [
    {
      logo: <HomeIcon className="w-6 h-6" />,
      name: <p>Dashboard </p>,
      path: "/app/dashboard",
    },
    {
      logo: <MapIcon className="w-6 h-6" />,
      name: <p>Maps</p>,
      path: "/app/maps",
    },
  ];

  const mockAvatar = "Kusmana";

  return (
    <aside
      className="fixed left-0 z-50 flex flex-col justify-between w-12 px-1 py-4 transition-all duration-100 ease-in-out bg-yellow-500 top-2 bottom-2 rounded-xl hover:w-64"
      onMouseEnter={() => setIsAsideHovered(true)}
      onMouseLeave={() =>
        setTimeout(() => {
          setIsAsideHovered(false);
        }, 100)
      }
    >
      <div className="flex flex-col flex-grow space-y-3">
        <div className="flex-shrink-0 w-60 space-x-2 !mr-1 mb-4 px-1">
          Logo Here
        </div>
        {sidebarItems.map((item, index) => (
          <button
            className={cn(
              "flex items-center flex-shrink-0 w-60 space-x-2 !mr-1 rounded-lg",
              {
                "bg-red-200": isAsideHovered && pathName.includes(item.path), // Apply blue background when aside is hovered // Apply background only when the path matches and it's not hovered
              }
            )}
            key={index}
            onClick={() => router.push(item.path)}
          >
            <div
              className={cn("rounded-lg p-2", {
                "bg-red-200 ": !isAsideHovered && pathName.includes(item.path), // Apply to logo when path matches
              })}
            >
              {item.logo}
            </div>
            {item.name}
          </button>
        ))}
      </div>
      <div className="flex items-center px-1 space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={mockAvatar}
            alt="user avatar"
            className={cn("rounded-full p-1")}
          />
          <AvatarFallback
            style={{ backgroundColor: "#216C76" }}
            className={cn("rounded-full p-1 font-bold text-white")}
          >
            {getUserNameInitial(mockAvatar)}
          </AvatarFallback>
        </Avatar>
        <p>{mockAvatar}</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
