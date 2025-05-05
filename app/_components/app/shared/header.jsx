"use client";

import { useState, useEffect } from "react";
import UserAvatar from "./user-avatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, Menu, X, Map, Layers, Users2, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleErrorMessage } from "@/helpers/string-helpers";
import { toast } from "@/components/ui/use-toast";
import useUserStore from "@/helpers/hooks/store/use-user-store";

const NAVIGATION_ITEMS = [
  { name: "Maps", path: "/app/maps", icon: <Map className="w-6 h-6" /> },
  { name: "Layers", path: "/app/layers", icon: <Layers className="w-6 h-6" /> },
];

const MOBILE_NAV_ITEMS = [
  { name: "Groups", path: "/app/groups", icon: <Users2 className="w-6 h-6" /> },
  { name: "Users", path: "/app/users", icon: <Users2 className="w-6 h-6" /> },
];

const AppHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();
  const { setIsEditor, setIsAdmin, isAdmin, isEditor } = useUserStore();

  useEffect(() => {
    if (session && session.user) {
      // Check if user is admin
      const isAdminRole =
        session.user?.roles?.some((role) =>
          role.roleName.toLowerCase().includes("admin")
        ) || false;

      const isEditorRole =
        session.user?.roles?.some((role) =>
          role.roleName.toLowerCase().includes("editor")
        ) || false;

      setIsAdmin(isAdminRole);
      setIsEditor(isEditorRole);
    }
  }, [session, setIsAdmin, setIsEditor]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathName]);

  const handleGroupView = () => {
    router.push("/app/groups");
  };

  const handleUserView = () => {
    router.push("/app/users");
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/auth/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText || "Unknown error");
      }

      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      const { title, description } = handleErrorMessage(error.status);
      toast({ title, description, variant: "destructive" });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full h-16">
        <Loader2 className="w-8 h-8 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  const MobileMenu = () => (
    <div className="fixed inset-0 bg-white z-50 animate-fadeIn">
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-8">
          <img
            src={`${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/geoportal-logo.svg`}
            alt="Geoportal"
            className="h-8"
          />
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center mb-8">
          <UserAvatar user={session?.user} className="w-8 h-8 mr-4" />
          <div>
            <h2 className="text-xl font-bold">{session?.user?.name}</h2>
            <p className="text-gray-600">{session?.user?.email}</p>
          </div>
        </div>

        <nav className="flex-grow">
          {NAVIGATION_ITEMS.map((item, index) => (
            <Link
              key={`mobile-menu-item-${index}`}
              href={item.path}
              className={cn(
                "flex items-center py-4 text-lg",
                pathName.includes(item.path)
                  ? "text-nileBlue-700 font-bold"
                  : "text-gray-700"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-4">{item.icon}</span>
              {item.name}
            </Link>
          ))}

          {MOBILE_NAV_ITEMS.map((item, index) => (
            <Link
              key={`mobile-menu-item-${index}`}
              href={item.path}
              className={cn(
                "flex items-center py-4 text-lg",
                pathName.includes(item.path)
                  ? "text-nileBlue-700 font-bold"
                  : "text-gray-700"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-4">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center text-red-500 py-4"
        >
          <LogOut className="mr-4 h-6 w-6" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <header className="shadow-lg">
      <div className="flex items-center justify-between w-full h-16 px-4 md:px-6">
        <div className="flex items-center">
          <img
            src={`${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/geoportal-logo.svg`}
            alt="logo"
            className="w-20 md:w-28"
          />
        </div>
        <nav className="hidden md:flex items-center justify-center gap-6">
          {NAVIGATION_ITEMS.map((item, index) => (
            <Link href={item.path} key={`desktop-menu-item-${index}`}>
              <button
                className={cn("rounded-xl font-bold px-3 py-1", {
                  "text-nileBlue-700": pathName.includes(item.path),
                })}
              >
                {item.name}
              </button>
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:block">
              <UserAvatar
                user={session?.user}
                className="w-8 h-8 text-xs cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2">
              <DropdownMenuLabel>{session?.user?.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem
                  className={cn(
                    pathName.includes("/app/users")
                      ? "text-nileBlue-700 font-bold"
                      : "text-gray-700"
                  )}
                  onClick={handleUserView}
                >
                  User
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className={cn(
                  pathName.includes("/app/groups")
                    ? "text-nileBlue-700 font-bold"
                    : "text-gray-700"
                )}
                onClick={handleGroupView}
              >
                Group
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 font-semibold hover:text-red-400"
                onClick={handleSignOut}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && <MobileMenu />}
    </header>
  );
};

export default AppHeader;
