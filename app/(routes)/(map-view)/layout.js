"use client";

import AppHeader from "@/app/_components/app/shared/header";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MapViewLayout = ({ children }) => {
  // TODO: Find how to handle this based on server
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.replace("/"); // Redirect to login if not authenticated
  }, [session, status, router]);

  return (
    // <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col mx-1 my-2">
    //   <AppHeader />
    <div className="w-full h-full bg-[#F7FFFB]">{children}</div>
    // <Toaster />
    // </div>
    // <div></div>
  );
};

export default MapViewLayout;
