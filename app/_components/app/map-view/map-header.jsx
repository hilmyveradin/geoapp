"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserAvatar from "../shared/user-avatar";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import { Menu, X } from "lucide-react"; // Assuming you're using lucide-react for icons

const MapHeader = () => {
  const { mapData, setMapData, setMapLayers } = useMapViewStore();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const resetData = () => {
    setMapLayers(null);
    setMapData(null);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink = ({ href, children }) => (
    <Link href={href}>
      <Button
        variant="ghost"
        className="w-full text-base font-medium md:w-auto"
        onClick={() => {
          resetData();
          setIsMenuOpen(false);
        }}
      >
        {children}
      </Button>
    </Link>
  );

  return (
    <div className="relative bg-white border shadow-xl z-10">
      <div className="flex items-center justify-between w-full h-14 px-2">
        <Label className="text-sm md:text-base font-medium truncate max-w-[200px] md:max-w-none">
          {mapData.mapTitle}
        </Label>
        <div className="flex items-center">
          <div className="hidden md:flex">
            {/* <NavLink href="/app/maps">Maps</NavLink> */}
            <NavLink href="/app/layers">Layers</NavLink>
          </div>
          <div className="pl-2 md:pl-4">
            <UserAvatar user={session.user} className="w-8 h-8 text-xs" />
          </div>
          <Button
            variant="ghost"
            className="md:hidden ml-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-t md:hidden">
          <div className="flex flex-col p-4">
            <NavLink href="/app/maps">Maps</NavLink>
            <NavLink href="/app/layers">Layers</NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapHeader;
