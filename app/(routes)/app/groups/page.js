"use client";

import GroupButtons from "@/app/_components/app/group-buttons";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const GruopsDashboard = () => {
  const [pageLoading, setPageLoading] = useState(true);

  if (!pageLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-10 h-10 stroke-blackHaze-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full px-8 mt-4">
      <GroupButtons />
    </div>
  );
};

export default GruopsDashboard;
