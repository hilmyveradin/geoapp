"use client";

import GroupButtons from "@/app/_components/app/group-buttons";
import GroupMembersPage from "@/app/_components/app/groups/group-members-page";
import GroupOverviewPage from "@/app/_components/app/groups/group-overview-page";
import useRefetchStore from "@/helpers/hooks/store/useRefetchStore";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const GroupOverview = ({ params }) => {
  const groupUid = params.slug;

  const [currentTab, setCurrentTab] = useState("overview");

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex justify-between px-4 bg-nileBlue-600">
        <p className="text-lg font-semibold text-white">Group Admin</p>
        <div className="flex gap-8">
          <button
            className={cn("", {
              "text-white font-semibold": currentTab === "overview",
            })}
            onClick={() => {
              setCurrentTab("overview");
            }}
          >
            Overview
          </button>
          <button
            className={cn("", {
              "text-white font-semibold": currentTab === "member",
            })}
            onClick={() => {
              setCurrentTab("member");
            }}
          >
            Member
          </button>
        </div>
      </div>
      <div>
        {currentTab === "overview" ? (
          <GroupOverviewPage groupUid={groupUid} />
        ) : (
          <GroupMembersPage groupUid={groupUid} />
        )}
      </div>
    </div>
  );
};

export default GroupOverview;
