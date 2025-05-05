import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserNameInitial } from "@/helpers/string-helpers";
import { cn } from "@/lib/utils";

const UserAvatar = (props) => {
  const { user, className } = props;
  return (
    <Avatar className={cn(className)}>
      <AvatarImage
        src={user?.avatar}
        alt="user avatar"
        className={cn("rounded-full p-1")}
      />
      <AvatarFallback
        style={{ backgroundColor: "#216C76" }}
        className={cn("rounded-full p-1 font-bold text-white")}
      >
        {getUserNameInitial(user.fullName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
