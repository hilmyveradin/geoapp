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

const UsersDashboard = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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
  }, []);

  const deleteUser = (userUid) => {
    // Implement delete user logic here
    console.log(`Deleting user with UID: ${userUid}`);
  };

  const sortData = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
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

  const SortableHeader = ({ column, children }) => (
    <TableHead className="cursor-pointer" onClick={() => sortData(column)}>
      {children}
      {sortColumn === column && (
        <span className="ml-2">{sortDirection === "asc" ? "▲" : "▼"}</span>
      )}
    </TableHead>
  );

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full px-8 mt-4">
      <UsersButtons />
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader column="fullName">Name</SortableHeader>
            <SortableHeader column="loginName">Username</SortableHeader>
            <SortableHeader column="role">Role</SortableHeader>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((user, index) => (
            <TableRow key={user.userUid}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.loginName}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    index === 0
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {index === 0 ? "Admin" : "Viewer"}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="mr-2">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersDashboard;
