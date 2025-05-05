"use client";

import GroupButtons from "@/app/_components/app/group-buttons";
import GroupCards from "@/app/_components/app/group-cards";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";
import useSearchQueryStore from "@/helpers/hooks/store/use-search-query-store";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const GroupsDashboard = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [groupsData, setGroupsData] = useState(null);

  const { refetchGroups } = useRefetchStore();
  const { searchedGroupTitle, setSearchedGroupTitle } = useSearchQueryStore();

  useEffect(() => {
    return () => {
      setSearchedGroupTitle("");
    };
  }, [setSearchedGroupTitle]);

  useEffect(() => {
    async function getGroupLists() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GEOPORTAL_PATH}/api/groups/get-groups`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setGroupsData(responseData);
      } catch (error) {
        console.error("Error during fetch:", error.message);
        setGroupsData({ status: "failed" });
      } finally {
        setPageLoading(false);
      }
    }

    getGroupLists().catch(console.error);
  }, [refetchGroups]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  if (!groupsData || groupsData.status === "failed") {
    return (
      <div className="w-full h-full px-8 mt-4">
        <GroupButtons />
        <div className="text-center mt-8">
          <p className="text-lg font-semibold text-gray-700">
            Groups are not available
          </p>
        </div>
      </div>
    );
  }

  const filteredGroups = groupsData.data.filter((group) =>
    group.groupName.toLowerCase().includes(searchedGroupTitle.toLowerCase())
  );

  return (
    <div className="w-full h-full px-8 mt-4">
      <GroupButtons />
      {filteredGroups.map((group) => (
        <GroupCards key={group.groupUid} group={group} />
      ))}
    </div>
  );
};

export default GroupsDashboard;
