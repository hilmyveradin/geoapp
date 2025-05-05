"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";

const ChangePropDialog = ({
  children,
  changePropType,
  objectUid,
  initialTitle,
  initialDescription,
  initialTags,
  onCompleteHandler,
}) => {
  const { toggleRefetchMaps, toggleRefetchLayers } = useRefetchStore();

  const { replaceMapLayersLayerProp, currentViewBbox } = useMapViewStore();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [submittingData, setSubmittingData] = useState(false);

  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);
  const [tagValue, setTagValue] = useState("");

  useEffect(() => {
    setTitleValue(initialTitle ?? "");
    setDescriptionValue(initialDescription ?? "");
    setSelectedTags(initialTags ?? []);
  }, [initialTitle, initialDescription, initialTags]);

  // Handle title change
  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };

  // Handle description change
  const handleDescriptionChange = (event) => {
    setDescriptionValue(event.target.value);
  };

  // TAG METHODS
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

  const changePropAction = () => {
    const changeMapProp = async () => {
      const body = {
        map_title: titleValue,
        map_description: descriptionValue,
        map_tags: selectedTags,
      };

      setSubmittingData(true);

      try {
        const response = await fetch(
          `/api/maps/change-prop?mapUid=${objectUid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Reset all the states
        setDescriptionValue("");
        setTitleValue("");
        setSelectedTags([]);
        setTagValue("");
        toggleRefetchMaps();

        toast({ title: "Success Change Map Properties", variant: "success" });
        setOpenDialog(false);

        if (onCompleteHandler) {
          onCompleteHandler();
        }
      } catch (error) {
        toast({
          title: "Error creating layer",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setSubmittingData(false);
      }
    };

    const changeLayerprop = async () => {
      const body = {
        layer_title: titleValue,
        layer_description: descriptionValue,
        layer_tags: selectedTags,
      };

      setSubmittingData(true);

      try {
        const response = await fetch(
          `/api/layers/change-prop?layerUid=${objectUid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const temp = await response.json();

        replaceMapLayersLayerProp(temp.data);

        // Reset all the states
        setDescriptionValue("");
        setTitleValue("");
        setSelectedTags([]);
        setTagValue("");
        toggleRefetchLayers();

        toast({ title: "Success Change Layer Properties", variant: "success" });

        setOpenDialog(false);

        if (onCompleteHandler) {
          onCompleteHandler();
        }
      } catch (error) {
        toast({
          title: "Error creating layer",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setSubmittingData(false);
      }
    };

    if (changePropType === "map") {
      changeMapProp();
    } else {
      changeLayerprop();
    }
  };

  const generateDialogTitle = () => {
    if (changePropType === "map") {
      return "Change Map Properties";
    } else {
      return "Change Layer Properties";
    }
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

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="font-bold">
          {generateDialogTitle()}
        </DialogHeader>
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-full font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
            onClick={changePropAction}
            disabled={submittingData}
          >
            {submittingData ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
                <span className="font-bold">Please wait</span>
              </span>
            ) : (
              <span>Change properties</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePropDialog;

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
