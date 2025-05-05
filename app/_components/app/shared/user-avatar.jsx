import { getUserNameInitial } from "@/app/_helpers/stringHelpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const UserAvatar = () => {
  const mockAvatar = "Kusmana";
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage
        src={mockAvatar}
        alt="user avatar"
        className={cn("rounded-full p-1")}
      />
      <AvatarFallback
        style={{ backgroundColor: "#216C76" }}
        className={cn("rounded-full p-1 font-bold text-white")}
      >
        {getUserNameInitial(mockAvatar)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
