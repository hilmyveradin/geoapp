"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const GroupCards = (props) => {
  const { data: session, status } = useSession();
  const { group } = props;

  return (
    <div className="flex items-center gap-4 p-2 mt-2 rounded-md shadow-md">
      <img className="!w-40 !h-40" />
      <div className="flex flex-col w-full">
        <p className="text-2xl font-semibold text-nileBlue-700">
          {group.groupName}
        </p>
        <div className="flex gap-4">
          <p>owner</p>
          <p className="text-nileBlue-700">user</p>
        </div>
        <div className="flex gap-4">
          <p>created</p>
          <p>{group.startDate ?? "-"}</p>
          <p>last update</p>
          <p>{group.endData ?? "-"}</p>
        </div>
      </div>
      {group.users.includes(session.user.userUid) ? (
        <Button variant="secondary">
          <span>leave group</span>
        </Button>
      ) : (
        <Button>
          <span>delete group</span>
        </Button>
      )}
    </div>
  );
};

export default GroupCards;
