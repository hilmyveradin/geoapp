"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import useGroupStore from "@/helpers/hooks/store/useGroupStore";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import useUsersStore from "@/helpers/hooks/store/useUserStore";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ShareDialog = ({ children }) => {
  const { toast } = useToast();
  const { mapData } = useMapViewStore();
  const { userList, setUserList } = useUsersStore();
  const { groupList, setGroupList } = useGroupStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const [sharedGroupList, setSharedGroupList] = useState([]);
  const [sharedUserList, setSharedUserList] = useState([]);
  const [submittingData, setSubmittingData] = useState(false);

  // Fetching necessary data
  useEffect(() => {
    if (openDialog) {
      const fetchSharedUsers = async () => {
        try {
          const response = await fetch("/api/users/list", { method: "GET" });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseJson = await response.json();
          setUserList(responseJson.data);
        } catch (error) {
          console.error("Error during fetch:", error.message);
          throw error; // Ensure the promise is rejected by throwing the error
        }
      };

      const fetchSharedGroups = async () => {
        try {
          const response = await fetch("/api/groups/list", { method: "GET" });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseJson = await response.json();
          setGroupList(responseJson.data);
        } catch (error) {
          console.error("Error during fetch:", error.message);
          throw error; // Ensure the promise is rejected by throwing the error
        }
      };

      const fetchSharedMaps = async () => {
        try {
          let response;
          if (mapData.mapType === "map") {
            response = await fetch(
              `/api/maps/shared_to?mapUid=${mapData.mapUid}`,
              { method: "GET" }
            );
          } else {
            response = await fetch(
              `/api/layers/shared_to?layerUid=${mapData.mapUid}`,
              { method: "GET" }
            );
          }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const jsonResponse = await response.json();
          setSharedGroupList(jsonResponse.data.groups);
          setSharedUserList(jsonResponse.data.users);
        } catch (error) {
          console.log("Error fetching data: ", error);
          throw error;
        }
      };

      setComponentLoading(true);

      Promise.all([fetchSharedUsers(), fetchSharedGroups(), fetchSharedMaps()])
        .then(() => {
          setComponentLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching share data:", error);
          toast({
            title: "Error Fetching share data",
            description: "Not all changes were saved successfully.",
            variant: "destructive",
          });
        });
    }
  }, [mapData.mapType, mapData.mapUid, openDialog]);

  const shareMapAction = async () => {
    const body = {
      groups: sharedGroupList,
      users: sharedUserList,
    };

    setSubmittingData(true);

    try {
      let response;
      if (mapData.mapType === "map") {
        response = await fetch(`/api/maps/share?mapUid=${mapData.mapUid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        response = await fetch(`/api/layers/share?layerUid=${mapData.mapUid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
    } finally {
      setSubmittingData(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {componentLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader className="font-bold">Share</DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="w-full" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="w-full font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
                onClick={() => shareMapAction()}
                disabled={submittingData}
              >
                {submittingData ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
                    <span className="font-bold">Please wait</span>
                  </span>
                ) : (
                  <span>Save</span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
