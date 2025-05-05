"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  List,
  Layers3,
  Map,
  Save,
  Share2,
  Printer,
  Pencil 
} from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";

const MapHeader = () => {
  return (
    <div>
      <div className="flex w-full h-16 justify-between items-center px-6 bg-[#F7FFFB]">
        <div className="flex flex-row justify-between">
          <Input placeholder="your_data_name" />
          <Button variant="ghost">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">New Map</Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
      <div className="flex w-full h-16 justify-between items-center bg-[#D9D9D93D]">
        <div className="flex flex-row justify-between pl-2">
          <Button variant="ghost" className="justify-items-start">
            <List className="mr-2 h-4 w-4" /> Details
          </Button>
          <Button variant="ghost">
            <Layers3 className="mr-2 h-4 w-4" /> Add Layer
          </Button>
          <Button variant="ghost">
            <Map className="mr-2 h-4 w-4" /> Basemap
          </Button>
        </div>
        <div className="flex flex-row justify-between pr-6">
          <Button variant="ghost">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="ghost">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="ghost">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Input placeholder="Find address or place" className="w-100"/>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
