"use client";

import UserAvatar from "./user-avatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
    {
      name: "Users",
      path: "/app/users",
    },
    {
      name: "Groups",
      path: "/app/groups",
    },
  ];

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full h-16">
        <Loader2 className="w-10 h-10 stroke-cts-500 animate-spin" />
      </div>
    );
  }

  const user = {
    ...session.user,
    fullName: session.user.fullname,
  };

  return (
    <div className="flex items-center justify-between w-full h-16 px-6">
      <div className="flex items-center w-20 h-16">
        <img src="/geoportal-logo.svg" alt="logo" />
      </div>
      <div className="flex items-center justify-center gap-6">
        {NAVIGATION_ITEMS.map((item, index) => {
          return (
            <Link href={item.path} key={`topbar-item-${index}`}>
              <button
                className={cn("rounded-xl font-bold px-3 py-1", {
                  "text-gableGreen-100": pathName.includes(item.path),
                })}
              >
                {item.name}
              </button>
            </Link>
          );
        })}
        <div className="ml-10">
          <UserAvatar user={user} className="w-8 h-8 text-xs" />
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
