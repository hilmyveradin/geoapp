"use client";

import { useState, useEffect } from "react";
import UserAvatar from "./user-avatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleErrorMessage } from "@/helpers/string-helpers";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();

  const NAVIGATION_ITEMS = [
    { name: "Maps", path: "/app/maps" },
    { name: "Layers", path: "/app/layers" },
    { name: "Groups", path: "/app/groups" },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathName]);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = new Error(response.statusText || "Unknown error");
        error.status = response.status;
        throw error;
      }

      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      const { title, description } = handleErrorMessage(error.status);
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full h-16">
        <Loader2 className="w-8 h-8 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full h-16 px-4 md:px-6">
      <div className="flex items-center">
        <img src="/geoportal-logo.svg" alt="logo" className="w-20 md:w-28" />
      </div>
      <div className="hidden md:flex items-center justify-center gap-6">
        {NAVIGATION_ITEMS.map((item, index) => (
          <Link href={item.path} key={`topbar-item-${index}`}>
            <button
              className={cn("rounded-xl font-bold px-3 py-1", {
                "text-nileBlue-700": pathName.includes(item.path),
              })}
            >
              {item.name}
            </button>
          </Link>
        ))}
        <div className="ml-10">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar
                user={session?.user}
                className="w-8 h-8 text-xs cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-red-500 font-semibold hover:text-red-400"
                onClick={handleSignOut}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white z-50 shadow-md">
          {NAVIGATION_ITEMS.map((item, index) => (
            <Link href={item.path} key={`mobile-topbar-item-${index}`}>
              <button
                className={cn("w-full text-left px-4 py-2", {
                  "text-nileBlue-700": pathName.includes(item.path),
                })}
              >
                {item.name}
              </button>
            </Link>
          ))}
          <button
            className="w-full text-left px-4 py-2 text-red-500"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
