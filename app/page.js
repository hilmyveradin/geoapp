"use client";

import Header from "@/app/_components/home/header";
import Footer from "./_components/home/footer";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login`);
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <Header />
      <div className="px-2 ">Dashboard content</div>
      <Footer />
    </main>
  );
};

export default Home;
