"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const MapHeader = () => {
  const { mapData } = useMapViewStore();
  return (
    <div>
      <div className="flex items-center justify-between w-full bg-white border shadow-xl h-14">
        <div className="flex flex-row justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-2 p-2">
              <Link href="/app/maps">
                <Button
                  className="flex items-center justify-between w-full !border"
                  variant="secondary"
                >
                  Maps
                  <span>
                    <ChevronRight className="stroke-2 stroke-greenGable-500 " />
                  </span>
                </Button>
              </Link>
              <Link href="/app/layers">
                <Button
                  className="flex items-center justify-between w-full !border"
                  variant="secondary"
                >
                  Layers
                  <span>
                    <ChevronRight className="stroke-2 stroke-greenGable-500 " />
                  </span>
                </Button>
              </Link>
            </SheetContent>
          </Sheet>
          {/* <h1 className="text-2xl">{`${mapData.title}`}</h1>  */}
          <Label className="pt-2 text-sm font-medium">{`${mapData.mapTitle}`}</Label>
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
