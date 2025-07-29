import AppHeader from "@/app/_components/app/shared/header";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AppLayout = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-nileBlue-50">
      <AppHeader />
      <main className="flex-grow w-full max-w-screen mx-auto px-4 sm:px-6 md:px-8 py-6 overflow-x-hidden">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
