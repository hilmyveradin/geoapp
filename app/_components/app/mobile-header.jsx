"use client";

import UserAvatar from "./user-avatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

const MobileHeader = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [MenuOpen, setMenuOpen] = useState(false);

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
    <>
      <div className="flex items-center justify-end w-full h-8 px-2">
        <Menu
          className="cursor-pointer"
          aria-label="Open Menu"
          onClick={() => setMenuOpen(true)}
        />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 flex transition-all left-[640px] duration-300",
          {
            "left-0": MenuOpen,
          }
        )}
      >
        {MenuOpen && (
          <div
            className="fixed inset-0 transition-all duration-300 bg-black opacity-50"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Drawer content */}
        <div className="relative flex flex-col justify-between w-full h-full p-4 ml-auto bg-white rounded-lg">
          <div className="flex flex-col justify-start w-full">
            <div className="flex items-center justify-between w-full">
              <img src="/geoportal-logo.svg" alt="logo" className="w-20 mb-4" />
              <X
                className="w-5 h-5 stroke-black"
                onClick={() => setMenuOpen(false)}
              />
            </div>
            {NAVIGATION_ITEMS.map((item, index) => {
              return (
                <button
                  key={`topbar-item-${index}`}
                  className={cn("rounded-xl font-bold px-2 py-1", {
                    "bg-green-400": pathName.includes(item.path),
                  })}
                  onClick={() => {
                    router.push(item.path);
                    setMenuOpen(false);
                  }}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
          <div className="mb-10">
            <UserAvatar />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
