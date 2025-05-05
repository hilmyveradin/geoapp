import AppHeader from "@/app/_components/app/shared/header";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AppLayout = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col w-full h-screen bg-nileBlue-50">
      <AppHeader />
      <div className="w-full">{children}</div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
