"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { 
  List,
  Layers3,
  Map,
  Save,
  Share2,
  Printer,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MapHeader = () => {
  return (
    <div>
      <div className="flex w-full h-10 justify-between items-center px-6 bg-[#F7FFFB]">
        <div className="flex flex-row justify-between">
          <Input placeholder="your_data_name" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">New Map</Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
      <div className="flex w-full h-10 justify-between items-center bg-[#D9D9D93D]">
        <div className="flex flex-row justify-between pl-2">
          <Button variant="ghost" className="justify-items-start">
            <List className="mr-2 h-4 w-4" /> Details
          </Button>
          <Button variant="ghost">
            <Layers3 className="mr-2 h-4 w-4" /> Add Layer
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Map className="mr-2 h-4 w-4" /> Basemap
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ScrollArea className="h-16 w-64 rounded-md">
                {/* TODO: Add thumbnails for basemap */}
                <Button variant="ghost">Basemap 1</Button>
                <Button variant="ghost">Basemap 2</Button>
                <Button variant="ghost">Basemap 3</Button>
                <Button variant="ghost">Basemap 4</Button>
                <Button variant="ghost">Basemap 5</Button>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-row justify-between pr-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
              <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Button variant="ghost">Save</Button>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <Dialog>
                <DialogTrigger>
                  <Button variant="ghost">Save As</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Map</DialogTitle>
                  </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="Tags" className="text-right">
                        Tags
                      </Label>
                      <Textarea
                        placeholder="Tags"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Button variant="ghost">Map Only</Button>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <Button variant="ghost">A3 Landscape</Button>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <Button variant="ghost">A3 Portrait</Button>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <Button variant="ghost">A4 Landscape</Button>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <Button variant="ghost">A4 Portrait</Button>
              <DropdownMenuSeparator></DropdownMenuSeparator>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input placeholder="Find address or place" className="w-100"/>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
