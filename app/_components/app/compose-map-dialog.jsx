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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import useRefetchStore from "@/helpers/hooks/store/useRefetchStore";

const ComposeMapDialog = (props) => {
  const { children } = props;
  const { toast } = useToast();
  const { toggleRefetchMaps } = useRefetchStore();

  const [layersData, setLayersData] = useState();

  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);
  const [tagValue, setTagValue] = useState("");

  const [openSearchCommand, setOpenSearchCommand] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const [selectedLayersData, setSelectedLayersData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [submittingData, setSubmittingData] = useState(false);

  // Define for rendering thumbnails every time page is changed
  useEffect(() => {
    // Define function to get layers API
    async function getLayersData() {
      try {
        const response = await fetch("/api/get-layers", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json();

        const tempLayers = temp.data
          .map((data) => {
            return {
              ...data,
              thumbnailUrl: `http://dev3.webgis.co.id/be/cms/layer/thumbnail/${data.thumbnailUrl}`,
            };
          })
          .sort((a, b) => a.layerTitle.localeCompare(b.layerTitle));

        setLayersData(tempLayers);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }

    getLayersData().catch(console.error);
  }, []);

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
    if (layersData) {
      const filteredAndSorted = layersData
        .filter((user) => {
          return !selectedLayersData.some(
            (selected) =>
              selected.layerUid.toLowerCase() === user.layerUid.toLowerCase()
          );
        })
        .sort((a, b) => a.layerTitle.localeCompare(b.layerTitle));
      setLayersData(filteredAndSorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLayersData]);

  const removeSelectedLayer = (data) => {
    setSelectedLayersData(
      selectedLayersData.filter((layer) => layer.layerUid !== data.layerUid)
    );
  };

  const handleLayerSelection = (data) => {
    const layerData = layersData.find(
      (layer) => layer.layerUid.toLowerCase() === data
    );

    // Create the layer data object

    // Add the new layer data to selectedLayersData
    setSelectedLayersData([...selectedLayersData, layerData]);

    // Clear the search input
    setSearchInput("");
  };

  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescriptionValue(event.target.value);
  };

  // MARK: DESCRIPTION VALUES
  const handleTagsKeyDown = (event) => {
    if (event.key === "Enter") {
      setSelectedTags([...selectedTags, tagValue]);
      setTagValue("");
    }
  };

  // This function can also handle input change if you want to keep track of the input value in state continuously
  const handleTagsChange = (event) => {
    setTagValue(event.target.value);
  };

  const removeSelectedTag = (data) => {
    setSelectedTags(selectedTags.filter((layer) => layer !== data));
  };

  const composeMapAction = () => {
    async function composeMap() {
      const body = {
        title: titleValue,
        description: descriptionValue,
        tags: selectedTags,
        layers: selectedLayersData.map((layer) => ({
          layer_uid: layer.layerUid,
        })),
      };

      setSubmittingData(true);
      try {
        const response = await fetch("/api/compose-map", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Reset all the states
        setDescriptionValue("");
        setTitleValue("");
        setSelectedTags([]);
        setTagValue("");
        setSelectedLayersData([]);
        setSearchInput("");
        setOpenSearchCommand(false);
        toast({ title: "Success Creating Map Layer", variant: "success" });
        toggleRefetchMaps();
        setTimeout(() => {
          setOpenDialog(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error creating layer",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Error during fetch:", error.message);
      } finally {
        setSubmittingData(false);
      }
    }

    composeMap();
  };

  // MARK: DISPLAY LOGICS
  const selectedTagsDisplay = () => {
    if (!selectedTags || selectedTags.length === 0) {
      return;
    }

    return (
      <>
        <div className="flex gap-2 mt-1 ml-2">
          {selectedTags.map((data, index) => (
            <SelectedTagPills
              key={`${data}|${index}`}
              removeSelectedTag={removeSelectedTag}
              data={data}
            />
          ))}
        </div>
      </>
    );
  };

  const selectedLayerDisplay = () => {
    if (!selectedLayersData || selectedLayersData.length === 0) {
      return;
    }

    return (
      <ScrollArea
        className={cn("flex h-24 pr-3", {
          "!h-16": selectedLayersData.length === 1,
        })}
      >
        <div className="flex flex-wrap gap-2">
          {selectedLayersData.map((data) => (
            <SelectedLayerPills
              key={data.layerUid}
              removeSelectedLayer={removeSelectedLayer}
              data={data}
            />
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="font-bold">Compose Your Map</DialogHeader>
        {/*Dialog Body*/}
        <div className="relative flex flex-col w-full space-y-2">
          <Input
            placeholder="Enter Title"
            onChange={handleTitleChange}
            value={titleValue}
          />

          <Input
            placeholder="Enter Description"
            onChange={handleDescriptionChange}
            value={descriptionValue}
          />

          <div className="flex flex-wrap items-center w-full border rounded-lg">
            {selectedTagsDisplay()}
            <Input
              className={cn(
                "flex-grow border-none w-fit focus-visible:ring-0",
                {
                  "flex-grow": selectedTags.length < 1,
                  "w-min": selectedTags.length > 0,
                }
              )}
              placeholder="Enter Tags"
              onKeyDown={handleTagsKeyDown}
              onChange={handleTagsChange}
              value={tagValue}
            />
          </div>
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
                  <CommandGroup className="command-group-class absolute right-0 mr-[20] mt-[50px] max-h-[246px] w-full !overflow-y-auto rounded-lg border border-solid border-neutral-100 bg-neutral-50 shadow-lg z-[100]">
                    {layersData?.map((data) => (
                      <CommandItem
                        key={data.layerUid}
                        value={data.layerUid}
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
          <Button
            className="w-full font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
            onClick={composeMapAction}
            disabled={selectedLayersData.length === 0 || submittingData}
          >
            {submittingData ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
                <span className="font-bold">Please wait</span>
              </span>
            ) : (
              <span> Compose Map</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMapDialog;

const SearchLayerPills = (props) => {
  const { data } = props;
  return (
    <div className="flex items-center w-full space-x-2">
      <img src={data.thumbnailUrl} alt="search pills" className="w-10 h-8" />
      <div className="flex flex-col space-y-2">
        <p className="w-[350px] truncate ">{data.layerTitle}</p>
        <div className="flex items-center space-x-1">
          <UserAvatar user={data.creator} className="w-7 h-7" />
          <p>{data.creator.fullName}</p>
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
        "flex h-16 max-w-sm items-center space-x-2 rounded-full border border-neutral-500",
        {
          "bg-red-50": isHovered,
        }
      )}
    >
      <img
        src={data.thumbnailUrl}
        alt="search pills"
        className="w-10 h-8 ml-4"
      />
      <p className="w-full text-xs truncate">{data.layerTitle}</p>
      <button
        onClick={() => removeSelectedLayer(data)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <X className="w-5 h-5 mr-3" />
      </button>
    </div>
  );
};

const SelectedTagPills = (props) => {
  const { data, removeSelectedTag } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex h-6 max-w-sm items-center space-x-1 rounded-full border border-neutral-500 px-2 justify-center",
        {
          "bg-red-50": isHovered,
        }
      )}
    >
      <p className="w-full text-xs">{data}</p>
      <button
        onClick={() => removeSelectedTag(data)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
