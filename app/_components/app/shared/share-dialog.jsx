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

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { useToast } from "@/components/ui/use-toast";
import useGroupStore from "@/helpers/hooks/store/useGroupStore";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import useUsersStore from "@/helpers/hooks/store/useUserStore";
import { DialogClose } from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { X } from "lucide-react";
import { UsersRound } from "lucide-react";
import { UserRound } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import UserAvatar from "./user-avatar";
import { cn } from "@/lib/utils";

const ShareDialog = ({ children }) => {
  const { toast } = useToast();
  const { mapData } = useMapViewStore();
  // const { userList, setUserList } = useUsersStore();
  const { groupList, setGroupList } = useGroupStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const [userList, setUserList] = useState([]);
  const [openSearchCommand, setOpenSearchCommand] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const [owner, setOwner] = useState();
  const [sharedGroupList, setSharedGroupList] = useState([]);
  const [sharedUserList, setSharedUserList] = useState([]);
  const [submittingData, setSubmittingData] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);

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
          setOwner(jsonResponse.data.owner);
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

  // Filter seraching logic
  useEffect(() => {
    if (userList) {
      const filteredAndSorted = userList
        .filter((user) => {
          return !selectedUsers.some(
            (selected) =>
              selected.userUid.toLowerCase() === user.userUid.toLowerCase()
          );
        })
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
      setUserList(filteredAndSorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUsers, searchInput]);

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

  //MARK: User Methods
  const removeSelectedUser = (user) => {
    setSelectedUsers((state) =>
      state.filter((tempUser) => tempUser.userUid !== user.userUid)
    );
  };

  const handleUserSelection = (newUserUid) => {
    const newUser = userList.find(
      (user) => user.userUid.toLowerCase() === newUserUid
    );

    // Add the new layer data to selectedLayersData
    setSelectedUsers((state) => [...state, newUser]);

    // Clear the search input
    setSearchInput("");
  };

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

  const selectedUsersDisplay = () => {
    if (!selectedUsers || selectedUsers.length === 0) {
      return;
    }

    return (
      <>
        <div className="flex flex-wrap max-w-full gap-2">
          {selectedUsers.map((user) => (
            <SelectedUsersPill
              key={user.userUid}
              removeSelectedUser={removeSelectedUser}
              user={user}
            />
          ))}
        </div>
      </>
    );
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
            <DialogHeader className="text-2xl font-bold">Share</DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex min-h-[48px] items-center justify-center rounded-lg border border-tn-500 overflow-y-auto py-2">
                <div className="flex flex-wrap items-center w-full gap-1 px-2">
                  {selectedUsersDisplay()}
                  <Command
                    className="flex-grow h-full rounded-full"
                    shouldFilter={false}
                  >
                    <CommandInput
                      className={cn(
                        "command-input-class ml-2 h-full !border-none flex py-2",
                        {
                          "flex-grow": selectedUsers.length < 1,
                          "w-auto": selectedUsers.length > 0,
                        }
                      )}
                      useMagnifiyGlassIcon={false}
                      placeholder="Search users"
                      onClick={() => {
                        setOpenSearchCommand(true);
                      }}
                      value={searchInput}
                      onValueChange={setSearchInput}
                    />
                    {openSearchCommand && (
                      <CommandGroup className="command-group-class absolute right-0 mr-[20] mt-[50px] max-h-[246px] w-full !overflow-y-auto rounded-lg border border-solid border-neutral-100 bg-neutral-50 shadow-lg z-[100]">
                        {userList
                          .filter((user) => {
                            if (searchInput) {
                              if (
                                user.fullName
                                  .toLowerCase()
                                  .includes(searchInput.toLowerCase())
                              ) {
                                return user;
                              } else {
                                return null;
                              }
                            } else {
                              return user;
                            }
                          })
                          .map((user) => {
                            return (
                              <CommandItem
                                key={`${user.userUid}`}
                                value={`${user.userUid}`}
                                onSelect={(userUid) =>
                                  handleUserSelection(userUid)
                                }
                                keywords={searchInput}
                                className="border-transparent"
                              >
                                <SearchUsersPill user={user} />
                              </CommandItem>
                            );
                          })}
                      </CommandGroup>
                    )}
                  </Command>
                </div>
                <Search className="items-center justify-center w-6 h-6 mr-3" />
              </div>
              <p className="text-lg font-bold">People who have access</p>
              <UserCard user={owner} />
              {sharedUserList.map((user) => {
                return <UserCard key={user.userUid} user={user} />;
              })}
              <p className="text-lg font-bold">Set group sharing</p>
              <div className="flex justify-between">
                <p>None yet</p>
                <button
                  className="flex items-center gap-3 px-2 py-1 border rounded-md shadow-lg"
                  variant="ghost"
                >
                  <UsersRound className="w-5 h-5 text-nileBlue-900" />
                  <span className="font-semibold text-nileBlue-900">
                    Edit group sharing
                  </span>
                </button>
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

const UserCard = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <UserRound className="w-6 h-6" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{user.fullName}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

const SearchUsersPill = ({ user }) => {
  return (
    <div className="flex items-center w-full space-x-2">
      <div className="flex flex-col space-y-2">
        <p className="w-[350px] truncate ">{user.fullName}</p>
        <div className="flex items-center space-x-1">
          <UserAvatar user={user} className="w-7 h-7" />
          <p>{user.fullName}</p>
        </div>
      </div>
    </div>
  );
};

const SelectedUsersPill = ({ user, removeSelectedUser }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex h-8 max-w-sm items-center gap-2 rounded-full border border-neutral-500 p-2",
        {
          "bg-red-50": isHovered,
        }
      )}
    >
      <p className="w-full text-xs truncate">{user.fullName}</p>
      <button
        onClick={() => removeSelectedUser(user)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <X className="w-5 h-5 mr-1" />
      </button>
    </div>
  );
};
