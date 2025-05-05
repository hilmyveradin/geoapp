import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex items-center justify-between w-full h-10 px-2 shadow-md">
      <div>Logo Here</div>
      <nav className="flex gap-4">
        <button> Home </button>
        <button> Features </button>
        <button> About Us </button>
      </nav>
      <div className="flex items-center justify-center">
        {session ? (
          <Link href="/app/maps">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
