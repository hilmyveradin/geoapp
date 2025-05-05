"use client";

import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DestructiveDialog from "../shared/destructive-dialog";
import useRefetchStore from "@/helpers/hooks/store/use-refetch-store";
import { toast } from "@/components/ui/use-toast";

const GroupCards = (props) => {
  const { data: session, status } = useSession();
  const { toggleRefetchGroups } = useRefetchStore();
  const { group } = props;
  const router = useRouter();

  const deleteGroup = async (groupUid) => {
    try {
      const response = await fetch(
        `/api/groups/delete-group?groupUid=${groupUid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toggleRefetchGroups();
      toast({ title: "Success deleting group", variant: "success" });
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center w-full p-4">
        <button
          className="flex flex-col sm:flex-row items-center text-left flex-grow"
          onClick={() => router.push(`groups/overview/${group.groupUid}`)}
        >
          <Users className="w-24 h-24 sm:w-32 sm:h-32 stroke-1 text-nileBlue-500 mb-4 sm:mb-0 sm:mr-6" />
          <div className="flex flex-col w-full space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-nileBlue-700 mb-2">
              {group.groupName}
            </h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="font-medium">Owner:</span>
              <span className="text-nileBlue-700">{group.creator}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="font-medium">Created:</span>
              <span>{group.startDate ?? "-"}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="font-medium">Last update:</span>
              <span>{group.endData ?? "-"}</span>
            </div>
          </div>
        </button>
        <div className="mt-4 sm:mt-0 sm:ml-4 flex justify-center sm:justify-end">
          {group?.creator === session.user.username ? (
            <DestructiveDialog
              title="Are you sure you want to delete this group?"
              actionText="Yes, I'm sure"
              action={() => deleteGroup(group.groupUid)}
            >
              <Button className="w-full sm:w-auto">Delete Group</Button>
            </DestructiveDialog>
          ) : group.users?.userUid.includes(session.user.userUid) ? (
            <Button variant="secondary" className="w-full sm:w-auto">
              Leave Group
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GroupCards;
