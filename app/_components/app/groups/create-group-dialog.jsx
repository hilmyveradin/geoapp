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
import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";
import UserAvatar from "../shared/user-avatar";

const CreateGroupDialog = (props) => {
  const { children } = props;
  const { toast } = useToast();
  const { toggleRefetchGroups } = useRefetchStore();

  const [users, setUsers] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);
  const [tagValue, setTagValue] = useState("");

  const [openSearchCommand, setOpenSearchCommand] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [submittingData, setSubmittingData] = useState(false);

  const [parentGroup, setParentGroup] = useState("");
  const [owner, setOwner] = useState("");

  useEffect(() => {
    async function getUsersData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/users/list`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const temp = await response.json();

        const tempUsers = temp.data.sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );

        setUsers(tempUsers);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }

    getUsersData().catch(console.error);
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
    if (users) {
      const filteredAndSorted = users
        .filter((user) => {
          return !selectedUsers.some(
            (selected) =>
              selected.userUid.toLowerCase() === user.userUid.toLowerCase()
          );
        })
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
      setUsers(filteredAndSorted);
    }
  }, [selectedUsers]);

  const removeSelectedUser = (data) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user.userUid !== data.userUid)
    );
  };

  const handleUserSelection = (data) => {
    const userData = users.find((user) => user.userUid.toLowerCase() === data);
    setSelectedUsers([...selectedUsers, userData]);
    setSearchInput("");
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleGroupDescriptionChange = (event) => {
    setGroupDescription(event.target.value);
  };

  const handleTagsKeyDown = (event) => {
    if (event.key === "Enter") {
      setSelectedTags([...selectedTags, tagValue]);
      setTagValue("");
    }
  };

  const handleTagsChange = (event) => {
    setTagValue(event.target.value);
  };

  const removeSelectedTag = (data) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== data));
  };

  const createGroupAction = () => {
    async function createGroup() {
      const body = {
        group_name: groupName,
        group_description: groupDescription,
        group_tags: selectedTags,
        user_uid: selectedUsers.map((user) => user.userUid),
        parent_uid: parentGroup || undefined,
        owner: owner || undefined,
      };

      setSubmittingData(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/groups/create-group`,
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
        setGroupName("");
        setGroupDescription("");
        setSelectedTags([]);
        setTagValue("");
        setSelectedUsers([]);
        setSearchInput("");
        setOpenSearchCommand(false);
        setParentGroup("");
        setOwner("");
        toast({ title: "Success Creating Group", variant: "success" });
        toggleRefetchGroups();
        setTimeout(() => {
          setOpenDialog(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error creating group",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Error during fetch:", error.message);
      } finally {
        setSubmittingData(false);
      }
    }

    createGroup();
  };

  const selectedTagsDisplay = () => {
    if (!selectedTags || selectedTags.length === 0) {
      return;
    }

    return (
      <>
        <div className="flex flex-wrap max-w-full gap-2 mt-1 ml-2">
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

  const selectedUserDisplay = () => {
    if (!selectedUsers || selectedUsers.length === 0) {
      return;
    }

    return (
      <ScrollArea
        className={cn("flex h-24 pr-3", {
          "!h-16": selectedUsers.length === 1,
        })}
      >
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((data) => (
            <SelectedUserPills
              key={data.userUid}
              removeSelectedUser={removeSelectedUser}
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
        <DialogHeader className="font-bold">Create New Group</DialogHeader>
        {/*Dialog Body*/}
        <div className="relative flex flex-col w-full space-y-2">
          <Input
            placeholder="Enter Group Name"
            onChange={handleGroupNameChange}
            value={groupName}
          />

          <Input
            placeholder="Enter Group Description"
            onChange={handleGroupDescriptionChange}
            value={groupDescription}
          />

          <div className="flex flex-wrap items-center w-full border rounded-lg">
            {selectedTagsDisplay()}
            <Input
              className={cn("border-none focus-visible:ring-0", {
                "flex-grow": selectedTags.length < 1,
                "w-auto": selectedTags.length > 0,
              })}
              placeholder="Enter Tags"
              onKeyDown={handleTagsKeyDown}
              onChange={handleTagsChange}
              value={tagValue}
            />
          </div>
          <div className="flex min-h-[48px] items-center justify-center rounded-lg border border-tn-500">
            <div className="flex flex-wrap items-center w-full gap-1 p-2">
              {selectedUserDisplay()}
              <Command
                className="flex-grow h-full rounded-full"
                shouldFilter={false}
              >
                <CommandInput
                  className={cn(
                    "command-input-class ml-2 h-full !border-none",
                    {
                      grow: selectedUsers.length < 1,
                      "w-min": selectedUsers.length > 0,
                    }
                  )}
                  placeholder="Search users"
                  onClick={() => {
                    setOpenSearchCommand(true);
                  }}
                  value={searchInput}
                  onValueChange={setSearchInput}
                />
                {openSearchCommand && (
                  <CommandGroup className="command-group-class absolute right-0 mr-[20] mt-[50px] max-h-[246px] w-full !overflow-y-auto rounded-lg border border-solid border-neutral-100 bg-neutral-50 shadow-lg z-[100]">
                    {users
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
                      .map((data, index) => {
                        return (
                          <CommandItem
                            key={`${index}`}
                            value={`${data.userUid}`}
                            onSelect={(data) => handleUserSelection(data)}
                            keywords={searchInput}
                            className="border-transparent"
                          >
                            <SearchUserPills data={data} />
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                )}
              </Command>
            </div>
            <Search className="items-center justify-center w-6 h-6 mr-3" />
          </div>
          <Input
            placeholder="Parent Group UID (Optional)"
            onChange={(e) => setParentGroup(e.target.value)}
            value={parentGroup}
          />
          <Input
            placeholder="Owner (Optional)"
            onChange={(e) => setOwner(e.target.value)}
            value={owner}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-full font-bold border-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100"
            onClick={createGroupAction}
            disabled={!groupName || submittingData}
          >
            {submittingData ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 stroke-2 stroke-blackHaze-500 animate-spin" />
                <span className="font-bold">Please wait</span>
              </span>
            ) : (
              <span>Create Group</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SearchUserPills = (props) => {
  const { data } = props;
  return (
    <div className="flex items-center w-full space-x-2">
      <UserAvatar user={data} className="w-10 h-10" />
      <div className="flex flex-col space-y-2">
        <p className="w-[350px] truncate ">{data.fullName}</p>
        <p className="text-sm text-gray-500">{data.email}</p>
      </div>
    </div>
  );
};

const SelectedUserPills = (props) => {
  const { data, removeSelectedUser } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex h-10 max-w-sm items-center space-x-2 rounded-full border border-neutral-500",
        {
          "bg-red-50": isHovered,
        }
      )}
    >
      <UserAvatar user={data} className="w-8 h-8 ml-1" />
      <p className="w-full text-xs truncate">{data.fullName}</p>
      <button
        onClick={() => removeSelectedUser(data)}
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

export default CreateGroupDialog;
