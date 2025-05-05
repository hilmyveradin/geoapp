"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { List, Layers3, Map, Save, Share2, Printer, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useMapViewStore from "@/helpers/hooks/useMapViewStore";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const MapHeader = () => {
  const { mapData } = useMapViewStore();
  return (
    <div>
      <div className="flex w-full h-14 justify-between items-center bg-white">
        {/* <div className="flex flex-row justify-between pl-2 space-x-8"> */}
          <div className="flex flex-row justify-between">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value="Pedro Duarte" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input id="username" value="@peduarte" className="col-span-3" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            {/* <h1 className="text-2xl">{`${mapData.title}`}</h1>  */}
            <Label className="pt-2 text-sm font-medium">{`${mapData.title}`}</Label>
          </div>
        {/* </div> */}
        {/* <div className="flex flex-row justify-between pr-6">
              <Dialog>
                <DialogTrigger>
                  <Button variant="ghost">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Map</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        defaultValue={`${mapData.title}`}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="Tags" className="text-right">
                        Tags
                      </Label>
                      <Textarea placeholder="Add Tags" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          <Button variant="ghost">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Printer className="w-4 h-4 mr-2" /> Print
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
          <Input placeholder="Find address or place" className="w-100" />
        </div> */}
      </div>
    </div>
  );
};

export default MapHeader;
