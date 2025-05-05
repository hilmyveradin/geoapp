"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useMapViewStore from "@/helpers/hooks/store/useMapViewStore";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserAvatar from "../shared/user-avatar";

const MapHeader = () => {
  const { mapData } = useMapViewStore();
  const { data: session, status } = useSession();
  const user = {
    ...session.user,
    fullName: session.user.fullname,
  };

  return (
    <div className="flex items-center justify-between w-full bg-white border shadow-xl h-14">
      <Label className="pl-12 text-base font-medium">{`${mapData.mapTitle}`}</Label>
      <div className="flex items-center">
        <div className="pr-2">
          <Link href="/app/maps">
            <Button variant="ghost" className="text-base font-medium hover:text-gableGreen-100 hover:font-bold">
              Maps
            </Button>
          </Link>
          <Link href="/app/layers">
            <Button variant="ghost" className="text-base font-medium hover:text-gableGreen-100 hover:font-bold">
              Layers
            </Button>
          </Link>
          {/* <Link href="/app/users">
            <Button variant="ghost" className="text-lg font-medium">
              Users
            </Button>
          </Link>
          <Link href="/app/groups">
            <Button variant="ghost" className="text-lg font-medium">
              Groups
            </Button>
          </Link> */}
        </div>
        <div className="pl-4 pr-2.5">
          <UserAvatar user={user} className="w-8 h-8 text-xs" />
        </div>
      </div>
    </div>
  );
};

export default MapHeader;

// import { Menu } from "lucide-react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { ChevronRight } from "lucide-react";
// const { mapData } = useMapViewStore();
// return (
//   <div>
//     <div className="flex items-center justify-between w-full bg-white border shadow-xl h-14">
//       <div className="flex flex-row justify-between">
//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="ghost">
//               <Menu className="w-4 h-4" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="flex flex-col gap-2 p-2">
//             <Link href="/app/maps">
//               <Button
//                 className="flex items-center justify-between w-full !border"
//                 variant="secondary"
//               >
//                 Maps
//                 <span>
//                   <ChevronRight className="stroke-2 stroke-greenGable-500 " />
//                 </span>
//               </Button>
//             </Link>
//             <Link href="/app/layers">
//               <Button
//                 className="flex items-center justify-between w-full !border"
//                 variant="secondary"
//               >
//                 Layers
//                 <span>
//                   <ChevronRight className="stroke-2 stroke-greenGable-500 " />
//                 </span>
//               </Button>
//             </Link>
//           </SheetContent>
//         </Sheet>
//         {/* <h1 className="text-2xl">{`${mapData.title}`}</h1>  */}
//         <Label className="pt-2 text-sm font-medium">{`${mapData.mapTitle}`}</Label>
//       </div>
//     </div>
//   </div>
// );