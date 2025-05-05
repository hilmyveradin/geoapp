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
    <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
      <AppHeader />
      <div className="w-full mx-1 my-2">{children}</div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
