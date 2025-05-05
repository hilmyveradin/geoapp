"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, UserCog, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DestructiveDialog from "@/app/_components/shared/destructive-dialog";
import UsersButtons from "@/app/_components/app/users-buttons";
import useUserStore from "@/helpers/hooks/store/use-user-store";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";

const UsersDashboard = () => {
  const { isAdmin } = useUserStore();
  const [pageLoading, setPageLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const { refetchUsers, toggleRefetchUsers } = useRefetchStore();

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch("/api/users/list", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setUsersData(responseData.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setPageLoading(false);
      }
    }

    getUsers();
  }, [refetchUsers]);

  const deleteUser = async (userUid) => {
    try {
      const response = await fetch(`/api/admin/user/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userUid: userUid }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast({ title: "Success deleting group", variant: "success" });
      toggleRefetchUsers();
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  const sortedData = [...usersData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ column, children }) => {
    const handleSort = () => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    };

    return (
      <TableHead
        className="cursor-pointer hover:bg-gray-200 transition-colors duration-200"
        onClick={handleSort}
      >
        <div className="flex items-center">
          {children}
          {sortColumn === column && (
            <span className="ml-2">{sortDirection === "asc" ? "▲" : "▼"}</span>
          )}
        </div>
      </TableHead>
    );
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full px-4 md:px-8 mt-2 md:mt-4">
      {isAdmin && <UsersButtons />}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <SortableHeader column="fullName">Name</SortableHeader>
              <SortableHeader column="loginName">Username</SortableHeader>
              <SortableHeader column="role">Role</SortableHeader>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((user) => (
              <TableRow key={user.userUid} className="hover:bg-gray-50">
                <TableCell className="font-medium p-2">
                  {user.fullName}
                </TableCell>
                <TableCell>{user.loginName}</TableCell>
                <TableCell>
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
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 hover:bg-gray-200"
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                    <DestructiveDialog
                      title="Are you sure you want to remove this user?"
                      description="This action cannot be undone"
                      actionText="Yes, I'm sure"
                      action={() => deleteUser(user.userUid)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DestructiveDialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersDashboard;
