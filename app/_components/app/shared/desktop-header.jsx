"use client";

import UserAvatar from "./user-avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleErrorMessage } from "@/helpers/string-helpers";
import { toast } from "@/components/ui/use-toast";

const DesktopHeader = () => {
  const pathName = usePathname();

  const { data: session, status } = useSession();

  const NAVIGATION_ITEMS = [
    {
      name: "Maps",
      path: "/app/maps",
    },
    {
      name: "Layers",
      path: "/app/layers",
    },
    // {
    //   name: "Users",
    //   path: "/app/users",
    // },
    {
      name: "Groups",
      path: "/app/groups",
    },
  ];

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      debugger;

      if (!response.ok) {
        const error = new Error(response.statusText || "Unknown error");
        error.status = response.status;
        throw error;
      }

      signOut();
    } catch {
      const { title, description } = handleErrorMessage(error.status);
      toast({
        title: title,
        description: description, // Provides more specific error detail
        variant: "destructive",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full h-16">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full h-16 px-6">
      <div className="flex items-center">
        <img src="/geoportal-logo.svg" alt="logo" className="w-28" />
      </div>
      <div className="flex items-center justify-center gap-6">
        {NAVIGATION_ITEMS.map((item, index) => {
          return (
            <Link href={item.path} key={`topbar-item-${index}`}>
              <button
                className={cn("rounded-xl font-bold px-3 py-1", {
                  "text-nileBlue-700": pathName.includes(item.path),
                })}
              >
                {item.name}
              </button>
            </Link>
          );
        })}
        <div className="ml-10">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar
                user={session.user}
                className="w-8 h-8 text-xs cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-red-500 font-semibold hover:text-red-400"
                onClick={() => handleSignOut()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
