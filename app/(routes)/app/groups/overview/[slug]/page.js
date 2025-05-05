"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import GroupOverviewPage from "@/app/_components/app/groups/group-overview-page";
import GroupMembersPage from "@/app/_components/app/groups/group-members-page";

const GroupOverview = ({ params }) => {
  const groupUid = params.slug;
  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between px-4 py-3 bg-nileBlue-600 text-white rounded-lg">
        <p className="text-lg font-semibold mb-2 sm:mb-0">Group Admin</p>
        <div className="flex gap-4">
          <TabButton
            active={currentTab === "overview"}
            onClick={() => setCurrentTab("overview")}
          >
            Overview
          </TabButton>
          <TabButton
            active={currentTab === "member"}
            onClick={() => setCurrentTab("member")}
          >
            Member
          </TabButton>
        </div>
      </div>
      <div className="p-4">
        {currentTab === "overview" ? (
          <GroupOverviewPage groupUid={groupUid} />
        ) : (
          <GroupMembersPage groupUid={groupUid} />
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button
    className={cn(
      "px-3 py-1 rounded transition-colors",
      active
        ? "bg-white text-nileBlue-600 font-semibold"
        : "text-white hover:bg-nileBlue-500"
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export default GroupOverview;
