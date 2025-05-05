"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between w-full h-10 px-2 shadow-md">
      <div>Logo Here</div>
      <nav className="flex gap-4">
        <button> Home </button>
        <button> Features </button>
        <button> About Us </button>
      </nav>
      <div className="flex items-center justify-center">
        <Button onClick={() => router.push("/login")}>Login</Button>
      </div>
    </div>
  );
};

export default Header;
