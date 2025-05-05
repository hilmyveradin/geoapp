"use client";

import GroupButtons from "@/app/_components/app/group-buttons";
import GroupCards from "@/app/_components/app/group-cards";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const GruopsDashboard = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [groupsData, setGroupsData] = useState([]);

  const { refetchGroups } = useRefetchStore();

  useEffect(() => {
    async function getGroupInfo(groupUid) {
      const response = await fetch(
        `/api/groups/get-group-info?groupUid=${groupUid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseeData = await response.json();

      return responseeData.data;
    }
    // Define function to get layers API
    async function getGroupLists() {
      try {
        const response = await fetch("/api/groups/get-groups", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const data = responseData.data;

        // Create an array of promises
        const groupDataPromises = data.map((groupAttributes) =>
          getGroupInfo(groupAttributes.groupUid)
        );

        // Wait for all promises to resolve
        const resolvedGroupData = await Promise.all(groupDataPromises);

        // Flatten the array of arrays (if necessary) and set the state
        const groupData = resolvedGroupData.flat(); // Use .flat() if each promise resolves to an array

        setGroupsData(groupData);
      } catch (error) {
        console.error("Error during fetch:", error.message);
      } finally {
        setPageLoading(false);
      }
    }

    getGroupLists()
      // make sure to catch any error
      .catch(console.error);
  }, [refetchGroups]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full px-8 mt-4">
      <GroupButtons />
      {groupsData.map((group, index) => {
        return <GroupCards key={group.groupUid} group={group} />;
      })}
    </div>
  );
};

export default GruopsDashboard;
