"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { useToast } from "@/components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { UsersRound } from "lucide-react";
import { UserRound } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import UserAvatar from "./user-avatar";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import useMapViewStore from "@/helpers/hooks/store/use-map-view-store";
import TooltipText from "@/app/_components/shared/tooltip-text";

const ShareDialog = ({ children }) => {
  // Utility function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Function to memoize colors for users and groups
  const useColorMemo = (items) => {
    const memoizedColors = useMemo(() => {
      const colors = {};
      items.forEach((item) => {
        colors[item.userUid || item.groupUid] = getRandomColor();
      });
      return colors;
    }, [items]);

    return memoizedColors;
  };

  const { toast } = useToast();
  const { mapData } = useMapViewStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);

  const [groupList, setGroupList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [openSearchCommand, setOpenSearchCommand] = useState(null);
  const [searchUserInput, setSearchUserInput] = useState("");

  const [currentView, setCurrentView] = useState("user");

  const [searchGroupInput, setSearchGroupInput] = useState("");

  const [owner, setOwner] = useState();
  const [sharedGroupList, setSharedGroupList] = useState([]);
  const [sharedUserList, setSharedUserList] = useState([]);
  const [submittingData, setSubmittingData] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const userColors = useColorMemo(userList);
  const groupColors = useColorMemo(groupList);

  // Fetching logic
  const fetchDataAndResetState = async () => {
    try {
      const [usersResponse, groupsResponse, mapsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/users/list`, {
          method: "GET",
        }),
        fetch(`${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/groups/list`, {
          method: "GET",
        }),
        fetch(
          mapData.mapType === "map"
            ? `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/shared_to?mapUid=${mapData.mapUid}`
            : `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/shared_to?layerUid=${mapData.mapUid}`,
          { method: "GET" }
        ),
      ]);

      if (!usersResponse.ok || !groupsResponse.ok || !mapsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [usersData, groupsData, mapsData] = await Promise.all([
        usersResponse.json(),
        groupsResponse.json(),
        mapsResponse.json(),
      ]);

      setUserList(usersData.data);
      setGroupList(groupsData.data);
      setOwner(mapsData.data.owner);
      setSharedGroupList(mapsData.data.groups);
      setSharedUserList(mapsData.data.users);
      setSelectedUsers([]);
      setSearchUserInput("");
      setSearchGroupInput("");
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({
        title: "Error Fetching share data",
        description: "Not all changes were saved successfully.",
        variant: "destructive",
      });
    } finally {
      setComponentLoading(false);
    }
  };

  useEffect(() => {
    if (openDialog) {
      setComponentLoading(true);
      fetchDataAndResetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog]);

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
  }, [selectedUsers, searchUserInput]);

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
    setSearchUserInput("");
  };

  //MARK: Group Methods
  const handleGroupSelection = (groupUid) => {
    setSharedGroupList((prevSharedGroupList) => {
      if (prevSharedGroupList.some((group) => group.groupUid === groupUid)) {
        return prevSharedGroupList.filter(
          (group) => group.groupUid !== groupUid
        );
      } else {
        const newGroup = groupList.find((group) => group.groupUid === groupUid);
        return [...prevSharedGroupList, newGroup];
      }
    });
  };

  // Check if a group is selected
  const isGroupSelected = (groupUid) => {
    return sharedGroupList.some((group) => group.groupUid === groupUid);
  };

  const shareMapAction = async () => {
    let body = {};

    if (sharedGroupList?.length > 0) {
      body["groups"] = sharedGroupList.map((group) => {
        return {
          group_uid: group.groupUid,
          perm: ["view"],
        };
      });
    }

    if (selectedUsers?.length > 0) {
      body["users"] = selectedUsers.map((user) => {
        return {
          user_uid: user.userUid,
          perm: ["view"],
        };
      });
    }

    setSubmittingData(true);

    try {
      let response;
      if (mapData.mapType === "map") {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/maps/share?mapUid=${mapData.mapUid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/layers/share?layerUid=${mapData.mapUid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Call the function to fetch data and reset states
      await fetchDataAndResetState();

      toast({
        title: "Success sharing data",
        variant: "success",
      });
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

  const generateCurrentView = () => {
    if (componentLoading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
        </div>
      );
    }

    if (currentView === "user") {
      return (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="text-xl font-bold">Share</p>
            </div>
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
                    value={searchUserInput}
                    onValueChange={setSearchUserInput}
                  />
                  {openSearchCommand && (
                    <CommandGroup className="command-group-class absolute right-0 mr-[20] mt-[50px] max-h-[246px] w-full !overflow-y-auto rounded-lg border border-solid border-neutral-100 bg-neutral-50 shadow-lg z-[100]">
                      {userList
                        .filter((user) => {
                          if (sharedUserList) {
                            if (
                              sharedUserList.some(
                                (shared) =>
                                  shared.userUid.toLowerCase() ===
                                  user.userUid.toLowerCase()
                              )
                            ) {
                              return null;
                            }
                          }

                          if (owner.userUid === user.userUid) {
                            return null;
                          }
                          if (searchUserInput) {
                            if (
                              user.fullName
                                .toLowerCase()
                                .includes(searchUserInput.toLowerCase())
                            ) {
                              return user;
                            } else {
                              return null;
                            }
                          }

                          return user;
                        })
                        .map((user) => {
                          return (
                            <CommandItem
                              key={`${user.userUid}`}
                              value={`${user.userUid}`}
                              onSelect={(userUid) =>
                                handleUserSelection(userUid)
                              }
                              keywords={searchUserInput}
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
            <div className="flex flex-col gap-4 overflow-y-auto max-h-80">
              <UserCard user={owner} color={userColors[owner.userUid]} />
              {sharedUserList.map((user) => {
                return (
                  <UserCard
                    key={user.userUid}
                    user={user}
                    color={userColors[user.userUid]}
                  />
                );
              })}
            </div>
            <p className="text-lg font-bold">Set group sharing</p>
            <div className="flex justify-between">
              {sharedGroupList?.length === 0 ? (
                <p>None yet</p>
              ) : (
                <div className="flex gap-2 overflow-x-auto">
                  {sharedGroupList.map((group) => (
                    <UsersRound
                      className="w-5 h-5"
                      key={group.groupUid}
                      color={groupColors[group.groupUid]}
                    />
                  ))}
                </div>
              )}

              <button
                className="flex items-center gap-3 px-2 py-1 border rounded-md shadow-lg"
                variant="ghost"
                onClick={() => {
                  setSearchUserInput("");
                  setCurrentView("group");
                }}
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
      );
    }

    if (currentView === "group") {
      return (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <ChevronLeft
                className="w-8 h-8 p-1 cursor-pointer"
                onClick={() => {
                  setSearchGroupInput("");
                  setCurrentView("user");
                }}
              />
              <p className="text-2xl font-bold">Group Sharing</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
              <input
                placeholder="Search groups"
                className="w-full border-none outline-none"
                onChange={(e) => setSearchGroupInput(e.target.value)}
              />
              <Search className="w-5 h-5" />
            </div>
            {groupList
              .filter((group) =>
                group.groupName
                  .toLowerCase()
                  .includes(searchGroupInput.toLowerCase())
              )
              .map((group) => {
                return (
                  <GroupCard
                    key={group.groupUid}
                    group={group}
                    isChecked={isGroupSelected(group.groupUid)}
                    onCheckedChange={() => handleGroupSelection(group.groupUid)}
                    color={groupColors[group.groupUid]}
                  />
                );
              })}
          </div>
        </>
      );
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <TooltipText content="Share Map" side="right" align="start">
        <DialogTrigger asChild>{children}</DialogTrigger>
      </TooltipText>
      <DialogContent>{generateCurrentView()}</DialogContent>
    </Dialog>
  );
};

export default ShareDialog;

const UserCard = ({ user, color }) => {
  return (
    <div className="flex items-center gap-4">
      <UserRound className="w-6 h-6" style={{ color: color }} />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{user.fullName}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

const GroupCard = ({ group, isChecked, onCheckedChange, color }) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={isChecked} onCheckedChange={onCheckedChange} />
      <UsersRound className="w-5 h-5" style={{ color: color }} />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{group.groupName}</p>
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
