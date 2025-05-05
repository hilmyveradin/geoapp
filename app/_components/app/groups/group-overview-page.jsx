import {
  Loader2,
  MapPin,
  Calendar,
  User,
  UserCog,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DestructiveDialog from "../../shared/destructive-dialog";
import { toast } from "@/components/ui/use-toast";
import InviteMembersDialog from "./invite-member-dialog";

const GroupOverviewPage = ({ groupUid }) => {
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchGroupInfo = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/groups/get-group-info?groupUid=${groupUid}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch group info");
      const responseData = await response.json();
      setGroupData(responseData.data);
    } catch (err) {
      console.error("Error during fetch:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupUid]);

  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo, refetchTrigger]);

  const deleteUser = async (userUid) => {
    try {
      const response = await fetch(
        `/api/groups/remove-group-user?groupUid=${groupUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userUids: [userUid] }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      toast({ title: "Successfully removed user", variant: "success" });
      setRefetchTrigger((prev) => prev + 1); // Trigger a refetch
    } catch (error) {
      console.error("Error removing user:", error.message);
      toast({ title: "Error removing user", variant: "destructive" });
    }
  };

  const handleInviteDialogClose = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!groupData) return <ErrorMessage message="No group data available" />;

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{groupData.groupName}</h1>
      </div>

      {/* Group Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Created: {groupData.startDate || "Not specified"}
              </li>
              <li className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Owner: {groupData.creator}
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Level: {groupData.level || "Not specified"}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{groupData.groupDescription || "No description available."}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {groupData.groupTags ? (
              <div className="flex flex-wrap gap-2">
                {groupData.groupTags.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </div>
            ) : (
              <p>No tags available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Group Members */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Group Members</CardTitle>
          <InviteMembersDialog
            groupUid={groupUid}
            onDialogClose={handleInviteDialogClose}
          >
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </InviteMembersDialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupData.users.map((user, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user}</TableCell>
                  <TableCell className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role.roleUid}
                          className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                        >
                          {role.roleName}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {index !== 0 && (
                      <>
                        <Button variant="ghost" size="sm" className="mr-2">
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <DestructiveDialog
                          title="Are you sure you want to remove this user from Group?"
                          description="This action cannot be undone"
                          actionText="Yes, I'm sure"
                          action={() => deleteUser(user)}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DestructiveDialog>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      {groupData.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{groupData.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-64">
    <Loader2 className="w-10 h-10 stroke-nileBlue-500 animate-spin" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-red-500 text-center p-4">{message}</div>
);

export default GroupOverviewPage;
