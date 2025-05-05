import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

const InviteMembersDialog = ({ groupUid, onDialogClose, children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (openDialog) {
      fetchUsers();
      fetchGroupMembers();
    }
  }, [openDialog]);

  useEffect(() => {
    const availableUsers = allUsers.filter(
      (user) => !groupMembers.includes(user.userUid)
    );
    const filtered = availableUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.loginName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers, groupMembers]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/users/list`
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setAllUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/groups/get-group-info?groupUid=${groupUid}`
      );
      if (!response.ok) throw new Error("Failed to fetch group members");
      const data = await response.json();
      setGroupMembers(data.data.users || []);
    } catch (error) {
      console.error("Error fetching group members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch group members",
        variant: "destructive",
      });
    }
  };

  const handleSelectUser = (userUid) => {
    setSelectedUsers((prev) =>
      prev.includes(userUid)
        ? prev.filter((id) => id !== userUid)
        : [...prev, userUid]
    );
  };

  const handleSelectAllOnPage = (event) => {
    if (event.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user.userUid));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleAddMembers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/groups/add-group-user?groupUid=${groupUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userUids: selectedUsers }),
        }
      );
      if (!response.ok) throw new Error("Failed to add users to group");
      toast({
        title: "Success",
        description: "Members added to the group successfully",
        variant: "success",
      });
      handleDialogClose(false);
    } catch (error) {
      console.error("Error adding members:", error);
      toast({
        title: "Error",
        description: "Failed to add members to the group",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = (open) => {
    setOpenDialog(open);
    if (!open) {
      // Dialog is closing
      onDialogClose();
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Invite members</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end">
                  <span className="mr-2">Select all on page</span>
                  <Checkbox
                    onCheckedChange={handleSelectAllOnPage}
                    checked={
                      filteredUsers.length > 0 &&
                      filteredUsers.every((user) =>
                        selectedUsers.includes(user.userUid)
                      )
                    }
                  />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.userUid}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell className="text-right">
                  <Checkbox
                    checked={selectedUsers.includes(user.userUid)}
                    onCheckedChange={() => handleSelectUser(user.userUid)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0}
          >
            Add member to group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersDialog;
