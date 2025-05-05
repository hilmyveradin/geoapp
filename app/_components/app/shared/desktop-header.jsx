"use client";

import UserAvatar from "./user-avatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const DesktopHeader = () => {
  const pathName = usePathname();
  const router = useRouter();

  const mockUser = {
    fullName: "Shadcn",
    avatar: "https://github.com/shadcn.png",
  };

  const NAVIGATION_ITEMS = [
    {
      name: "Maps",
      path: "/app/maps",
    },
    {
      name: "Layers",
      path: "/app/layers",
    },
    {
      name: "Users",
      path: "/app/users",
    },
    {
      name: "Groups",
      path: "/app/groups",
    },
  ];

  return (
    <div className="flex items-center justify-between w-full h-20 px-6">
      <div className="flex items-center w-20 h-16">
        <img src="/geoportal-logo.svg" alt="logo" />
      </div>
      <div className="flex items-center justify-center gap-6">
        {NAVIGATION_ITEMS.map((item, index) => {
          return (
            <button
              key={`topbar-item-${index}`}
              className={cn("rounded-xl font-bold px-2 py-1", {
                "bg-green-400": pathName.includes(item.path),
              })}
              onClick={() => router.push(item.path)}
            >
              {item.name}
            </button>
          );
        })}
        <div className="ml-10">
          <UserAvatar user={mockUser} className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
