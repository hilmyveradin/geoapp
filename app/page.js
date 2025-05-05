"use client";
import Header from "@/app/_components/home/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Footer from "./_components/home/footer";

const Home = () => {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <Header />
      <div className="px-2 ">Dashboard content</div>
      <Footer />
    </main>
  );
};

export default Home;
