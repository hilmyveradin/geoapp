"use client";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import UserAvatar from "./shared/user-avatar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import useLayerStore from "@/helpers/hooks/useLayerStore";

const ComposeMapDialog = (props) => {
  const { children } = props;

  const { layersData } = useLayerStore();
  const [localLayersData, setLocalLayersData] = useState();
  const [openSearchCommand, setOpenSearchCommand] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  // const [mockLayersData, setMockLayersData] = useState();
  const [selectedLayersData, setSelectedLayersData] = useState([]);

  useEffect(() => {
    setLocalLayersData(layersData);
  }, [layersData]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        openSearchCommand &&
        !event.target.closest(".command-group-class") &&
        !event.target.closest(".command-input-class")
      ) {
        setOpenSearchCommand(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openSearchCommand]);

  useEffect(() => {
    if (localLayersData) {
      const filteredAndSorted = localLayersData
        .filter((user) => {
          return !selectedLayersData.some(
            (selected) =>
              selected.layer_uid.toLowerCase() === user.layer_uid.toLowerCase()
          );
        })
        .sort((a, b) => a.title.localeCompare(b.title));
      setLocalLayersData(filteredAndSorted);
    }
  }, [selectedLayersData]);

  useEffect(() => {
    console.log(selectedLayersData.length);
  }, [selectedLayersData]);

  const removeSelectedLayer = (data) => {
    debugger;
    setSelectedLayersData(
      selectedLayersData.filter((layer) => layer.layer_uid !== data.layer_uid)
    );
  };

  const handleLayerSelection = (data) => {
    // Splitting the data string into an array of values
    const values = data.split("|");

    // Assuming the order of values is consistent and as expected:
    // data = `${data.layer_uid}|${data.thumbnail}|${data.title}|${data.user.fullName}|${data.user.avatar}`
    // values[0] = layer_uid, values[1] = thumbnail, values[2] = title, values[3] = fullName, values[4] = avatar

    // Create a mockUser object
    const mockUser = {
      fullName: values[3],
      avatar: values[4],
    };

    // Create the layer data object
    const layerData = {
      layer_uid: values[0],
      thumbnail: values[1],
      title: values[2],
      user: mockUser,
    };

    // Add the new layer data to selectedLayersData
    setSelectedLayersData([...selectedLayersData, layerData]);

    // Clear the search input
    setSearchInput("");
  };

  const composeMapAction = () => {
    // Reset all the states
    setSelectedLayersData([]);
    setSearchInput("");
    setOpenSearchCommand(false);
  };

  const selectedLayerDisplay = () => {
    if (!selectedLayersData || selectedLayersData.length === 0) {
      return;
    }

    return (
      <>
        {selectedLayersData.map((data) => (
          <SelectedLayerPills
            key={data.layer_uid}
            removeSelectedLayer={removeSelectedLayer}
            data={data}
          />
        ))}
      </>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="font-bold">Compose Your Map</DialogHeader>
        {/*Dialog Body*/}
        <div className="relative flex flex-col w-full">
          <Input placeholder="Enter Title" />
          <Input placeholder="Enter Description" />
          <Input placeholder="Enter Tags" />
          <div className="flex min-h-[48px] items-center justify-center rounded-lg border border-tn-500">
            <div className="flex flex-wrap items-center w-full gap-1 p-2">
              {selectedLayerDisplay()}
              <Command className="flex-grow h-full rounded-full">
                <CommandInput
                  className={cn(
                    "command-input-class ml-2 h-full !border-none",
                    {
                      grow: selectedLayersData.length < 1,
                      "w-min": selectedLayersData.length > 0,
                    }
                  )}
                  placeholder="Search layer name"
                  onClick={() => {
                    setOpenSearchCommand(true);
                  }}
                  value={searchInput}
                  onValueChange={setSearchInput}
                />
                {openSearchCommand && (
                  <CommandGroup className="command-group-class absolute right-0 mr-[20] mt-[50px] max-h-[246px] w-full !overflow-y-auto rounded-lg border border-solid border-neutral-100 bg-neutral-50 shadow-lg">
                    {localLayersData?.map((data) => (
                      <CommandItem
                        key={data.layer_uid}
                        value={`${data.layer_uid}|${data.thumbnail}|${data.title}|${data.user.fullName}|${data.user.avatar}`}
                        onSelect={(data) => handleLayerSelection(data)}
                        className="border-transparent"
                      >
                        <SearchLayerPills data={data} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </div>
            <Search className="items-center justify-center w-6 h-6 mr-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
              onClick={composeMapAction}
              disabled={selectedLayersData.length === 0}
            >
              Compose Map
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMapDialog;

const SearchLayerPills = (props) => {
  const { data } = props;
  return (
    <div className="flex items-center justify-center">
      <img src={data.thumbnail} alt="search pills" className="w-5 h-5" />
      <div className="flex flex-col items-center justify-center">
        <p>{data.title}</p>
        <div className="flex items-center justify-center">
          <UserAvatar user={data.user} />
          <p>{data.user.fullName}</p>
        </div>
      </div>
    </div>
  );
};

const SelectedLayerPills = (props) => {
  const { data, removeSelectedLayer } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex h-8 w-fit items-center justify-center space-x-1 rounded-full border border-neutral-500",
        {
          "bg-red-50": isHovered,
        }
      )}
    >
      <img src={data.thumbnail} alt="search pills" className="w-5 h-5" />
      <p className="text-xs">{data.title}</p>
      <button
        onClick={() => removeSelectedLayer(data)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <X className="mr-1 h-5 w-5 p-0.5" />
      </button>
    </div>
  );
};
